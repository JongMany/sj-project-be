import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto } from 'src/auth/dto/login-request.dto';
import { TokenResponseDto } from 'src/auth/dto/token-response.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-access.guard';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';

import { RegisterUserRequestDto } from 'src/user/dto/register-user.request.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { JwtRefreshAuthGuard } from 'src/auth/guard/jwt-refresh.guard';
import { LocalAuthGuard } from 'src/auth/guard/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(
    @Body() registerDto: RegisterUserRequestDto,
  ): Promise<{ success: boolean; message: string; statusCode: number }> {
    const userEntity: UserEntity = await this.authService.register(registerDto);
    return {
      success: true,
      message: `${userEntity.name}님, 회원가입을 성공하셨습니다.`,
      statusCode: 201,
    };
  }

  @Post('/login')
  @UsePipes(new ValidationPipe())
  @UseGuards(LocalAuthGuard)
  async login(@Body() user: LoginRequestDto): Promise<TokenResponseDto> {
    const { accessToken, refreshToken, group, name } =
      await this.authService.login(user);
    return {
      token: { accessToken, refreshToken },
      success: true,
      email: user.email,
      group,
      name,
    };
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Get('/refresh')
  async refreshAccessToken(
    @CurrentUser() userId: string,
  ): Promise<{ accessToken: string }> {
    return this.authService.refreshAccessToken(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logout(@CurrentUser() userId: string): Promise<{ message: string }> {
    await this.authService.logout(userId);
    return { message: '로그아웃 성공.' };
  }
}
