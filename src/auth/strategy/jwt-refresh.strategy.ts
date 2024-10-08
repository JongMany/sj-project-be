import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from 'src/auth/auth.service';
import { Payload } from 'src/auth/strategy/token-payload.type';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    console.log('JwtAccessTokenStrategy', ExtractJwt);
    super({
      jwtFromRequest: ExtractJwt?.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('app.jwt.refreshSecret'),
      passReqToCallback: true,
      ignoreExpiration: false,
    });
  }

  async validate(req: Request, payload: Payload) {
    const refreshToken = req.headers['authorization'].split(' ')[1]; // client request의 헤더에서 토큰값 가져오기('Bearer ' 제거)

    const isTokenValid = await this.authService.isRefreshTokenValid(
      refreshToken,
      payload.userId,
    );
    if (!isTokenValid) {
      throw new UnauthorizedException('유효한 토큰이 아닙니다.');
    }

    return payload.userId;
  }
}
