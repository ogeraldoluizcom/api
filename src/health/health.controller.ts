import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  checkHealth() {
    return {
      status: 'Server is running - Test',
      timestamp: new Date().toISOString(),
    };
  }
}
