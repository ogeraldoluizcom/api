import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { HealthModule } from './health/health.module';
import { CasesController } from './cases/cases.controller';
import { CasesModule } from './cases/cases.module';
import { UploadService } from './upload/upload.service';

@Module({
  imports: [ConfigModule.forRoot(), HealthModule, CasesModule],
  controllers: [CasesController],
  providers: [UploadService],
})
export class AppModule {}
