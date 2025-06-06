import { Injectable } from '@nestjs/common';

import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { CasesRepository } from './repositories/cases.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CasesService {
  constructor(
    private readonly repository: CasesRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(createCaseDto: CreateCaseDto) {
    const { cover = '', gallery = [], ...rest } = createCaseDto as any;
    return this.repository.create({
      ...rest,
      cover,
      gallery,
    });
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: string) {
    return this.repository.findOne(id);
  }

  async update(id: string, updateCaseDto: UpdateCaseDto) {
    const { cover = '', gallery = [], ...rest } = updateCaseDto as any;

    return this.repository.update(id, {
      ...rest,
      cover,
      gallery,
    });
  }

  async remove(id: string) {
    return this.repository.remove(id);
  }
}
