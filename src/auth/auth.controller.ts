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
import { RegisterUserRequestDto } from 'src/user/dto/register-user.request.dto';
import { UserEntity } from 'src/user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(
    @Body() registerDto: RegisterUserRequestDto,
  ): Promise<UserEntity> {
    return this.authService.register(registerDto);
  }

  // @UseGuards(LocalAuthGuard)
  @Post('/login')
  @UsePipes(new ValidationPipe())
  async login(@Body() user: LoginRequestDto): Promise<TokenResponseDto> {
    console.log('user', user);
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
