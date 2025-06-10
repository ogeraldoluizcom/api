import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login({
    email,
    password,
  }: LoginUserDto): Promise<{ token: string; name: string }> {
    const user = await this.findUserByEmail(email);
    await this.ensureValidPassword(password, user.password);
    return this.createToken(user.email, user.name);
  }

  async register(
    dto: RegisterUserDto,
  ): Promise<{ token: string; name: string }> {
    await this.ensureEmailNotExists(dto.email);

    const hashedPassword = await this.hashPassword(dto.password);
    const newUser = this.buildUserEntity(dto, hashedPassword);
    const createdUser = await this.usersService.create(newUser);

    return this.createToken(createdUser.email, createdUser.name);
  }

  private async findUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  private async ensureValidPassword(plain: string, hashed: string) {
    const isValid = await bcrypt.compare(plain, hashed);
    if (!isValid) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async ensureEmailNotExists(email: string) {
    const exists = await this.prisma.user.findUnique({ where: { email } });
    if (exists) {
      throw new HttpException('Email already in use', HttpStatus.CONFLICT);
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private buildUserEntity(
    dto: RegisterUserDto,
    hashedPassword: string,
  ): CreateUserDto {
    return {
      email: dto.email,
      name: dto.name,
      password: hashedPassword,
    };
  }

  private createToken(
    email: string,
    name: string,
  ): { token: string; name: string } {
    const token = this.jwt.sign({ email, name });
    return { token, name };
  }
}
