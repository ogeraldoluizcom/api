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
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const result = await this.authService.login(loginUserDto);

    res.cookie('auth_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60, // 1 hour
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Login is successfully',
      data: result,
    };
  }

  @Post('/logout')
  async logout(@Res({ passthrough: true }) res: Response): Promise<any> {
    res.clearCookie('auth_token');
    return {
      statusCode: HttpStatus.OK,
      message: 'Logout is successfully',
    };
  }

  @Post('/register')
  async register(@Body() registerDto: RegisterUserDto): Promise<any> {
    const result = await this.authService.register(registerDto);

    return {
      statusCode: HttpStatus.OK,
      message: 'Login is successfully',
      data: result,
    };
  }
}
