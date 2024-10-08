import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-local';
import { Payload } from 'src/auth/strategy/token-payload.type';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    console.log('JwtAccessTokenStrategy', ExtractJwt);
    super({
      jwtFromRequest: ExtractJwt?.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: Payload) {
    // return payload.userId;
    try {
      return payload;
    } catch (error) {
      throw error;
    }
  }
}
