import { CustomThrottlerGuard } from './custom-throttler.guard';
import { ThrottlerModuleOptions } from '@nestjs/throttler';

describe('CustomThrottlerGuard', () => {
  it('should be defined', () => {
    const mockOptions: Partial<ThrottlerModuleOptions> = {
      throttlers: [
        {
          ttl: 120000, // Time to live in milliseconds (2 minutes)
          limit: 10, // Maximum of 10 requests per IP
        },
      ],
    }; // Use Partial to avoid type errors
    const mockStorageService = {
      getRecord: jest.fn(),
      addRecord: jest.fn(),
      increment: jest.fn(), // Mock increment method to satisfy ThrottlerStorage interface
    }; // Mock storage service

    const mockReflector = {
      get: jest.fn(),
      getAll: jest.fn(),
      getAllAndMerge: jest.fn(),
      getAllAndOverride: jest.fn(),
    }; // Mock Reflector with required methods

    const guard = new CustomThrottlerGuard(
      mockOptions as ThrottlerModuleOptions, // Cast to the correct type
      mockStorageService,
      mockReflector as any, // Cast mockReflector to match Reflector type
    );

    expect(guard).toBeDefined();
  });
});
