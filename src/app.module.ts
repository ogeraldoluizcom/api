import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { HealthModule } from './health/health.module';
import { CasesController } from './cases/cases.controller';
import { CasesModule } from './cases/cases.module';
import { UploadService } from './upload/upload.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HealthModule,
    CasesModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [CasesController, UsersController],
  providers: [UploadService],
})
export class AppModule {}
