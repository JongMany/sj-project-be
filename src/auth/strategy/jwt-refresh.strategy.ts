import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from 'src/auth/auth.service';
import { Payload } from 'src/auth/strategy/token-payload.type';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt?.fromAuthHeaderAsBearerToken(),
      // jwtFromRequest: ExtractJwt.fromExtractors([
      //   (req: Request) => {
      //     console.log(req.headers['authorization']);
      //     return req.headers['authorization'];
      //   },
      // ]),
      secretOrKey: configService.get<string>('app.jwt.refreshSecret'),
      passReqToCallback: true,
      // ignoreExpiration: false,
    });
  }

  async validate(req: Request, payload: Payload) {
    try {
      console.log(
        'Authorization Header:',
        req.headers['authorization'],
        payload,
      ); // 헤더 확인
      const refreshToken = req.headers['authorization'].split(' ')[1]; // Bearer token
      const isTokenValid = await this.authService.isRefreshTokenValid(
        refreshToken,
        payload.userId,
      );
      console.log('isTokenValid', isTokenValid);
      if (!isTokenValid) {
        throw new UnauthorizedException('유효한 토큰이 아닙니다.');
      }
      return isTokenValid;
    } catch (error) {
      console.error('JwtRefreshTokenStrategy validate Error:', error);
      throw error;
    }
  }
}
