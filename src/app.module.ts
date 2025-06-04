import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { HealthModule } from './health/health.module';
import { CasesController } from './cases/cases.controller';
import { CasesModule } from './cases/cases.module';

@Module({
  imports: [ConfigModule.forRoot(), HealthModule, CasesModule],
  controllers: [CasesController],
  providers: [],
})
export class AppModule {}
