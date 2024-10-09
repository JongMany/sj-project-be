import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginRequestDto } from 'src/auth/dto/login-request.dto';

import { RedisService } from 'src/redis/redis.service';
import { RegisterUserRequestDto } from 'src/user/dto/register-user.request.dto';
import { UserService } from 'src/user/user.service';

// const CACHE_SERVICE = 'CacheService';

@Injectable()
export class AuthService {
  constructor(
    // @InjectRepository(UserEntity)
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    // @Inject(CACHE_SERVICE)
    private readonly cacheService: RedisService,
  ) {}

  async register(registerDto: RegisterUserRequestDto) {
    console.log('registerDto', registerDto);
    // return await this.userService.register(registerDto);
  }

  async validateUser(email: string, plainTextPassword: string) {
    const user = await this.userService.findByEmail(email);
    const isPasswordValid = user.checkPassword(plainTextPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.');
    }
    return user;
  }

  async verifyPassword(plainTextPassword: string, hashedPassword: string) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );

    if (!isPasswordMatching) {
      throw new BadRequestException('비밀번호를 확인해주세요.');
    }
  }

  async login(user: LoginRequestDto) {
    const id = user.id;

    const accessToken = await this.generateAccessToken(id);
    const refreshToken = await this.generateRefreshToken(id);

    await this.setRefreshToken(id, refreshToken);

    return { accessToken, refreshToken };
  }

  private async generateAccessToken(userId: string) {
    const token = this.jwtService.sign(
      { userId },
      {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
      },
    );

    return token;
  }

  private async generateRefreshToken(userId: string) {
    const token = this.jwtService.sign(
      { userId },
      {
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: Number(
          this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
        ),
      },
    );

    return token;
  }

  // Refresh Token을 Redis 서버에 userId를 key로 저장
  async setRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const ttl = this.configService.get('RT_JWT_EXPIRATION_TIME'); // TTL 값 설정
    await this.cacheService.insert(
      `refreshToken:${userId}`,
      refreshToken,
      +ttl,
    );
  }

  async refreshAccessToken(userId: string): Promise<{ accessToken: string }> {
    const accessToken = await this.generateAccessToken(userId);
    return { accessToken };
  }

  async isRefreshTokenValid(
    refreshToken: string,
    userId: string,
  ): Promise<string | null> {
    const storedRefreshToken = await this.getRefreshToken(userId);

    if (!storedRefreshToken) {
      return null;
    }
    const isMatch = storedRefreshToken === refreshToken;
    return isMatch ? userId : null;
  }

  async getRefreshToken(userId: string): Promise<string | null> {
    const refreshToken = await this.cacheService.get(`refreshToken:${userId}`);
    return refreshToken;
  }

  async logout(userId: string): Promise<void> {
    await this.cacheService.delete(`refreshToken:${userId}`);
  }
}
