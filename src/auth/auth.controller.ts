import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(
    @Body() loginDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginDto);

    this.setAuthCookie(res, result.token);

    return this.buildResponse(HttpStatus.OK, 'Login successful', result);
  }

  @Post('/logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('auth_token');
    return this.buildResponse(HttpStatus.OK, 'Logout successful');
  }

  @Post('/register')
  async register(@Body() registerDto: RegisterUserDto) {
    const result = await this.authService.register(registerDto);
    return this.buildResponse(HttpStatus.OK, 'Register successful', result);
  }

  private setAuthCookie(res: Response, token: string) {
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60, // 1 hour
      domain: '.ogeraldoluiz.com',
    });
  }

  private buildResponse(statusCode: number, message: string, data?: any) {
    return { statusCode, message, data };
  }
}
