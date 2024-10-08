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
import { JwtRefreshAuthGuard } from 'src/auth/guard/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @UseGuards(LocalAuthGuard)
  @Post('/login')
  @UsePipes(new ValidationPipe())
  async login(@Body() user: LoginRequestDto): Promise<TokenResponseDto> {
    return this.authService.login(user);
  }

  @Get('/refresh')
  @UseGuards(JwtRefreshAuthGuard)
  refreshAccessToken(
    @CurrentUser() userId: string,
  ): Promise<{ accessToken: string }> {
    return this.authService.refreshAccessToken(userId);
  }

  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  async logOut(@CurrentUser() userId: string): Promise<{ message: string }> {
    await this.authService.logout(userId);
    return { message: '로그아웃 성공.' };
  }
}
