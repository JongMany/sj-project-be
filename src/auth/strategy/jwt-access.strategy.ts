import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Payload } from 'src/auth/strategy/token-payload.type';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('app.jwt.accessSecret'),
      ignoreExpiration: false, // false는 Passport에 검증 위임
    });
  }

  async validate(payload: Payload) {
    console.log('accessToken', payload.userId);
    try {
      return payload.userId;
    } catch (error) {
      throw error;
    }
  }
}
