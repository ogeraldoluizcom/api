/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockImplementation((plain, hashed) => {
    // Simula senha correta
    return Promise.resolve(
      (plain === '123456' && hashed === 'hashed') ||
        (plain === '123456' && hashed === 'hashedPassword'),
    );
  }),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let usersService: UsersService;

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        findUnique: jest.fn(),
      },
    };
    const mockJwtService = {
      sign: jest.fn(),
    };
    const mockUsersService = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login and return token', async () => {
      const loginDto = { email: 'test@example.com', password: '123456' };
      const user = {
        email: 'test@example.com',
        password: 'hashed',
        name: 'Test',
      };
      const token = 'jwt-token';

      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(user as any);
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = await service.login(loginDto);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(result).toEqual({ token, name: user.name });
    });

    it('should throw if user not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(
        service.login({ email: 'notfound@example.com', password: '123' }),
      ).rejects.toThrowError(HttpException);

      await expect(
        service.login({ email: 'notfound@example.com', password: '123' }),
      ).rejects.toMatchObject({
        response: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found',
        },
        status: HttpStatus.NOT_FOUND,
      });
    });

    it('should throw if password is incorrect', async () => {
      const user = {
        email: 'test@example.com',
        password: 'hashed',
        name: 'Test',
      };
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(user as any);

      await expect(
        service.login({ email: 'test@example.com', password: 'wrong' }),
      ).rejects.toThrowError(HttpException);

      await expect(
        service.login({ email: 'test@example.com', password: 'wrong' }),
      ).rejects.toMatchObject({
        response: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Username or password is incorrect',
        },
        status: HttpStatus.BAD_REQUEST,
      });
    });
  });

  describe('register', () => {
    it('should register and return token', async () => {
      const registerDto = {
        email: 'new@example.com',
        password: '123456',
        name: 'New',
      };
      const hashedPassword = 'hashedPassword';
      const user = {
        email: 'new@example.com',
        password: hashedPassword,
        name: 'New',
      };
      const token = 'jwt-token';

      jest.spyOn(usersService, 'create').mockResolvedValue(user as any);
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = await service.register(registerDto);

      expect(usersService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: registerDto.email,
          password: hashedPassword,
          name: registerDto.name,
        }),
      );
      expect(result).toEqual({ token, name: user.name });
    });
  });

  describe('private methods', () => {
    it('findUserByEmail should throw if not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      // @ts-ignore
      await expect(
        service['findUserByEmail']('notfound@example.com'),
      ).rejects.toThrow(HttpException);
    });

    it('verifyPassword should throw if invalid', async () => {
      // @ts-ignore
      await expect(
        service['verifyPassword']('plain', 'hashed'),
      ).rejects.toThrow(HttpException);
    });

    it('hashPassword should return hashed password', async () => {
      jest.spyOn(bcrypt as any, 'hash').mockResolvedValue('hashedPassword');
      // @ts-ignore
      const result = await service['hashPassword']('plain');
      expect(result).toBe('hashedPassword');
    });

    it('createUserEntity should return UserEntity', () => {
      const dto = { email: 'a@a.com', password: '123', name: 'A' };
      // @ts-ignore
      const result = service['createUserEntity'](dto, 'hashed');
      expect(result).toEqual(
        expect.objectContaining({
          email: dto.email,
          password: 'hashed',
          name: dto.name,
        }),
      );
    });

    it('generateToken should return token and name', () => {
      jest.spyOn(jwtService, 'sign').mockReturnValue('token');
      // @ts-ignore
      const result = service['generateToken']('a@a.com', 'A');
      expect(result).toEqual({ token: 'token', name: 'A' });
    });
  });
});
