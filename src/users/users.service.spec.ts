import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersRepository } from './repositories/users.repository';

describe('UsersService', () => {
  let service: UsersService;
  const mockUsersRepository = {};
  const mockPrismaService = {}; // Add a mock PrismaService

  // Import the actual UsersRepository class or symbol

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: mockUsersRepository },
        { provide: PrismaService, useValue: mockPrismaService }, // se necessário
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
