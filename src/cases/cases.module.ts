import { Module } from '@nestjs/common';
import { CasesService } from './cases.service';
import { CasesRepository } from './repositories/cases.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [CasesService, CasesRepository, PrismaService],
  exports: [CasesService, CasesRepository],
})
export class CasesModule {}
