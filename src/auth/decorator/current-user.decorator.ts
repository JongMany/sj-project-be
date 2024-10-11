import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from 'src/user/entities/user.entity';

// 요청안에 있는 user 값을 가지고 온다.
export const CurrentUser = createParamDecorator(
  (data, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest();
    console.log('CurrentUser req.user:', req.user, req.userId);
    return req.user;
  },
);
