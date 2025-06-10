import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
  };

  const mockResponse = () => {
    const res: Partial<Response> = {};
    res.cookie = jest.fn().mockReturnValue(res);
    res.clearCookie = jest.fn().mockReturnValue(res);
    return res as Response;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should login and set cookie', async () => {
    const dto: LoginUserDto = { email: 'test@test.com', password: '123456' };
    const token = 'jwt-token';
    mockAuthService.login.mockResolvedValue({ token });

    const res = mockResponse();
    const result = await controller.login(dto, res);

    expect(authService.login).toHaveBeenCalledWith(dto);
    expect(res.cookie).toHaveBeenCalledWith(
      'auth_token',
      token,
      expect.objectContaining({ httpOnly: true }),
    );
    expect(result).toEqual({
      statusCode: 200,
      message: 'Login successful',
      data: { token },
    });
  });

  it('should logout and clear cookie', () => {
    const res = mockResponse();
    const result = controller.logout(res);

    expect(res.clearCookie).toHaveBeenCalledWith('auth_token');
    expect(result).toEqual({
      statusCode: 200,
      message: 'Logout successful',
    });
  });

  it('should register a user', async () => {
    const dto: RegisterUserDto = {
      email: 'test@test.com',
      password: '123456',
      name: 'Test',
    };
    const user = { id: 1, ...dto };
    mockAuthService.register.mockResolvedValue(user);

    const result = await controller.register(dto);

    expect(authService.register).toHaveBeenCalledWith(dto);
    expect(result).toEqual({
      statusCode: 200,
      message: 'Register successful',
      data: user,
    });
  });
});
