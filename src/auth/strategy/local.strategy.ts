import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from 'src/auth/auth.service';

// 클라이언트로부터 받은 이메일과 비밀번호를 사용해 유효한 유저인지 검증
// email, password로 로그인
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string) {
    try {
      const user = await this.authService.validateUser(email, password);
      console.log('LocalStrategy validate:', user);
      if (!user) {
        throw new UnauthorizedException('로그인 정보가 정확하지 않습니다.');
      }
      return user;
    } catch (error) {
      console.error('LocalStrategy validate Error:', error);
      throw new UnauthorizedException('로그인 처리 중 문제가 발생했습니다.');
    }
  }
}
