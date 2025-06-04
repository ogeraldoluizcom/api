import { Test, TestingModule } from '@nestjs/testing';
import { CasesService } from './cases.service';
import { CasesRepository } from './repositories/cases.repository';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';

const mockCase = {
  id: '1',
  title: 'Test Case',
  description: 'This is a test case',
};

const mockCasesRepository = {
  create: jest.fn().mockResolvedValue(mockCase),
  findAll: jest.fn().mockResolvedValue([mockCase]),
  findOne: jest.fn().mockResolvedValue(mockCase),
  update: jest.fn().mockResolvedValue({ ...mockCase, title: 'Updated' }),
  remove: jest.fn().mockResolvedValue({ deleted: true }),
};

class MockPrismaService {}

describe('CasesService', () => {
  let service: CasesService;
  let repository: CasesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CasesService,
        { provide: CasesRepository, useValue: mockCasesRepository },
        { provide: PrismaService, useClass: MockPrismaService },
      ],
    }).compile();

    service = module.get<CasesService>(CasesService);
    repository = module.get<CasesRepository>(CasesRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a case', async () => {
    const dto: CreateCaseDto = {
      title: 'Test Case',
      description: 'This is a test case',
    };
    const result = await service.create(dto);
    expect(repository.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockCase);
  });

  it('should return all cases', async () => {
    const result = await service.findAll();
    expect(repository.findAll).toHaveBeenCalled();
    expect(result).toEqual([mockCase]);
  });

  it('should return one case by id', async () => {
    const result = await service.findOne('1');
    expect(repository.findOne).toHaveBeenCalledWith('1');
    expect(result).toEqual(mockCase);
  });

  it('should update a case', async () => {
    const dto: UpdateCaseDto = { title: 'Updated' };
    const result = await service.update('1', dto);
    expect(repository.update).toHaveBeenCalledWith('1', dto);
    expect(result).toEqual({ ...mockCase, title: 'Updated' });
  });

  it('should remove a case', async () => {
    const result = await service.remove('1');
    expect(repository.remove).toHaveBeenCalledWith('1');
    expect(result).toEqual({ deleted: true });
  });
});
