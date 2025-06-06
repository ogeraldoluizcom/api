import { Test, TestingModule } from '@nestjs/testing';
import { CasesController } from './cases.controller';
import { CasesService } from './cases.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { UploadService } from '../upload/upload.service';

class MockCasesRepository {}

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
    const moduleBuilder = Test.createTestingModule({
      controllers: [CasesController],
      providers: [
        { provide: CasesService, useValue: mockCasesService },
        { provide: 'CasesRepository', useClass: MockCasesRepository },
        {
          provide: UploadService,
          useValue: {
            uploadFile: jest.fn().mockResolvedValue('mocked-upload-url'),
          },
        }, // Mock UploadService with correct token and uploadFile function
      ],
    });
    const module: TestingModule = await moduleBuilder.compile();

    controller = module.get<CasesController>(CasesController);
    service = module.get<CasesService>(CasesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a case', async () => {
    // Mock Express.Multer.File objects for cover and gallery
    const mockFile: Express.Multer.File = {
      fieldname: 'cover',
      originalname: 'cover.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 123,
      buffer: Buffer.from(''),
      destination: '',
      filename: 'cover.jpg',
      path: '',
      stream: undefined as any,
    };
    const mockGalleryFile1: Express.Multer.File = {
      fieldname: 'gallery',
      originalname: 'image1.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 123,
      buffer: Buffer.from(''),
      destination: '',
      filename: 'image1.jpg',
      path: '',
      stream: undefined as any,
    };
    const mockGalleryFile2: Express.Multer.File = {
      fieldname: 'gallery',
      originalname: 'image2.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 123,
      buffer: Buffer.from(''),
      destination: '',
      filename: 'image2.jpg',
      path: '',
      stream: undefined as any,
    };

    const dto: CreateCaseDto = {
      title: 'Test Case',
      description: 'This is a test case',
      techs: ['TypeScript', 'NestJS'], // Add required techs property
    };
    // Provide a mock user or context as the second argument
    const files = {
      cover: [mockFile],
      gallery: [mockGalleryFile1, mockGalleryFile2],
    };
    const result = await controller.create(files, dto);
    expect(service.create).toHaveBeenCalledWith({
      ...dto,
      cover: 'mocked-upload-url',
      gallery: ['mocked-upload-url', 'mocked-upload-url'],
    });
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
    // Mock Express.Multer.File objects for cover and gallery (as in create test)
    const mockFile: Express.Multer.File = {
      fieldname: 'cover',
      originalname: 'cover.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 123,
      buffer: Buffer.from(''),
      destination: '',
      filename: 'cover.jpg',
      path: '',
      stream: undefined as any,
    };
    const mockGalleryFile1: Express.Multer.File = {
      fieldname: 'gallery',
      originalname: 'image1.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 123,
      buffer: Buffer.from(''),
      destination: '',
      filename: 'image1.jpg',
      path: '',
      stream: undefined as any,
    };
    const files = {
      cover: [mockFile],
      gallery: [mockGalleryFile1],
    };
    const result = await controller.update('1', files, dto);
    expect(service.update).toHaveBeenCalledWith('1', {
      ...dto,
      cover: 'mocked-upload-url',
      gallery: ['mocked-upload-url'],
    });
    expect(result).toEqual({ ...mockCase, title: 'Updated' });
  });

  it('should remove a case', async () => {
    const result = await controller.remove('1');
    expect(service.remove).toHaveBeenCalledWith('1');
    expect(result).toEqual({ deleted: true });
  });
});
