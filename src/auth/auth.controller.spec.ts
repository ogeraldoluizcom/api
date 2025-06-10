import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const mockAuthService = {
      login: jest.fn(),
      register: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return login response', async () => {
    const loginDto = { email: 'test@example.com', password: '123456' };
    const loginResult = { token: 'token' };
    jest.spyOn(authService, 'login').mockResolvedValue(loginResult);

    const mockResponse: any = { cookie: jest.fn() };
    const response = await controller.login(loginDto as any, mockResponse);

    expect(authService.login).toHaveBeenCalledWith(loginDto);
    expect(response).toEqual({
      statusCode: HttpStatus.OK,
      message: 'Login is successfully',
      data: loginResult,
    });
  });

  it('should return register response', async () => {
    const registerDto = {
      email: 'test@example.com',
      password: '123456',
      name: 'Test',
    };
    const registerResult = { token: 'token' };
    jest.spyOn(authService, 'register').mockResolvedValue(registerResult);

    const response = await controller.register(registerDto as any);

    expect(authService.register).toHaveBeenCalledWith(registerDto);
    expect(response).toEqual({
      statusCode: HttpStatus.OK,
      message: 'Login is successfully',
      data: registerResult,
    });
  });
});
