import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { CreateCaseDto } from '../dto/create-case.dto';
import { UpdateCaseDto } from '../dto/update-case.dto';

@Injectable()
export class CasesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCaseDto: CreateCaseDto) {
    const createCase = await this.prisma.case.create({
      data: {
        ...createCaseDto,
      },
    });

    if (!createCase) {
      throw new Error('Case creation failed');
    }

    return createCase;
  }

  async findAll() {
    const cases = await this.prisma.case.findMany();

    if (!cases) {
      throw new Error('No cases found');
    }

    return cases;
  }

  async findOne(id: string) {
    const caseData = await this.prisma.case.findUnique({
      where: { id },
    });

    if (!caseData) {
      throw new Error(`Case with ID ${id} not found`);
    }

    return caseData;
  }

  async update(id: string, updateCaseDto: UpdateCaseDto) {
    const updatedCase = await this.prisma.case.update({
      where: { id },
      data: {
        ...updateCaseDto,
      },
    });

    if (!updatedCase) {
      throw new Error(`Case with ID ${id} not found or update failed`);
    }

    return updatedCase;
  }

  async remove(id: string) {
    const deletedCase = await this.prisma.case.delete({
      where: { id },
    });

    if (!deletedCase) {
      throw new Error(`Case with ID ${id} not found or deletion failed`);
    }

    return deletedCase;
  }
}
