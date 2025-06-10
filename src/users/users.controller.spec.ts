import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersController', () => {
  let controller: UsersController;
  const mockUsersRepository = {};
  const mockPrismaService = {}; // Add a mock PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide:
            UsersService.name === 'UsersService'
              ? UsersService
              : 'UsersRepository',
          useValue: mockUsersRepository,
        },
        { provide: PrismaService, useValue: mockPrismaService }, // se necessário
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
