import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/entities/user.entity';

import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login(loginUserDto: LoginUserDto): Promise<{ token: string }> {
    const { email, password } = loginUserDto;

    const user = await this.findUserByEmail(email);

    await this.verifyPassword(password, user.password);

    return this.generateToken(user.email, user.name);
  }

  async register(registerUserDto: RegisterUserDto): Promise<{ token: string }> {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: registerUserDto.email },
    });

    if (existingUser) {
      throw new HttpException(
        {
          statusCode: HttpStatus.CONFLICT,
          message: 'E-mail already exists',
        },
        HttpStatus.CONFLICT,
      );
    }

    const hashedPassword = await this.hashPassword(registerUserDto.password);
    const newUser = this.createUserEntity(registerUserDto, hashedPassword);

    const user = await this.usersService.create(newUser);

    return this.generateToken(user.email, user.name);
  }

  private async findUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.prismaService.user.findUnique({ where: { email } });

    if (!user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  private async verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<void> {
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordValid) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Username or password is incorrect',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private createUserEntity(
    registerUserDto: RegisterUserDto,
    hashedPassword: string,
  ): UserEntity {
    const user = new UserEntity();

    user.email = registerUserDto.email;
    user.password = hashedPassword;
    user.name = registerUserDto.name;

    return user;
  }

  private generateToken(
    email: string,
    name: string,
  ): { token: string; name: string } {
    const token = this.jwtService.sign({ email, name });

    return { token, name };
  }
}
