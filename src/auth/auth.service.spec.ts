import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { HttpException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: any;
  let jwt: Partial<Record<keyof JwtService, jest.Mock>>;
  let usersService: Partial<Record<keyof UsersService, jest.Mock>>;

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
      },
    };

    jwt = {
      sign: jest.fn(),
    };

    usersService = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwt },
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return a token and name when credentials are valid', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);

      prisma.user.findUnique = jest.fn().mockResolvedValue({
        email,
        name: 'Test User',
        password: hashedPassword,
      });

      jwt.sign = jest.fn().mockReturnValue('mocked-jwt-token');

      const result = await service.login({ email, password });

      expect(result).toEqual({ token: 'mocked-jwt-token', name: 'Test User' });
      expect((prisma.user as any).findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(jwt.sign).toHaveBeenCalledWith({ email, name: 'Test User' });
    });

    it('should throw if user is not found', async () => {
      (prisma.user as any) = {
        findUnique: jest.fn().mockResolvedValue(null),
      };

      await expect(
        service.login({ email: 'notfound@example.com', password: 'pass' }),
      ).rejects.toThrow(HttpException);
    });

    it('should throw if password is invalid', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue({
        email: 'test@example.com',
        name: 'Test User',
        password: await bcrypt.hash('correctpassword', 10),
      });

      await expect(
        service.login({ email: 'test@example.com', password: 'wrongpassword' }),
      ).rejects.toThrow(HttpException);
    });
  });
});
