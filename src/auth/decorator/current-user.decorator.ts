import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// 요청안에 있는 user 값을 가지고 온다.
export const CurrentUser = createParamDecorator(
  (data, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
