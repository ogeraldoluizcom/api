import { Test, TestingModule } from '@nestjs/testing';
import { CasesController } from './cases.controller';
import { CasesService } from './cases.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';

class MockCasesRepository {}
class MockPrismaService {}

describe('CasesController', () => {
  let controller: CasesController;
  let service: CasesService;

  const mockCase = {
    id: '1',
    title: 'Test Case',
    description: 'This is a test case',
  };

  const mockCasesService = {
    create: jest.fn().mockResolvedValue(mockCase),
    findAll: jest.fn().mockResolvedValue([mockCase]),
    findOne: jest.fn().mockResolvedValue(mockCase),
    update: jest.fn().mockResolvedValue({ ...mockCase, title: 'Updated' }),
    remove: jest.fn().mockResolvedValue({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CasesController],
      providers: [
        { provide: CasesService, useValue: mockCasesService },
        { provide: 'CasesRepository', useClass: MockCasesRepository },
        { provide: 'PrismaService', useClass: MockPrismaService },
      ],
    }).compile();

    controller = module.get<CasesController>(CasesController);
    service = module.get<CasesService>(CasesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a case', async () => {
    const dto: CreateCaseDto = {
      title: 'Test Case',
      description: 'This is a test case',
    };
    const result = await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockCase);
  });

  it('should return all cases', async () => {
    const result = await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual([mockCase]);
  });

  it('should return one case by id', async () => {
    const result = await controller.findOne('1');
    expect(service.findOne).toHaveBeenCalledWith('1');
    expect(result).toEqual(mockCase);
  });

  it('should update a case', async () => {
    const dto: UpdateCaseDto = { title: 'Updated' };
    const result = await controller.update('1', dto);
    expect(service.update).toHaveBeenCalledWith('1', dto);
    expect(result).toEqual({ ...mockCase, title: 'Updated' });
  });

  it('should remove a case', async () => {
    const result = await controller.remove('1');
    expect(service.remove).toHaveBeenCalledWith('1');
    expect(result).toEqual({ deleted: true });
  });
});
