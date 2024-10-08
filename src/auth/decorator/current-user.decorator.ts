import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// LocalAuthGuard에서 로그인 성공 시 req.user에 저장한 유저 정보를 가져오는 데코레이터
export const CurrentUser = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
