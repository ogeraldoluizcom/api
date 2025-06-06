import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreateCaseDto } from '../dto/create-case.dto';
import { UpdateCaseDto } from '../dto/update-case.dto';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CasesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createCaseDto: CreateCaseDto & {
      cover: string;
      gallery: string[];
    },
  ) {
    try {
      const createCase = await this.prisma.case.create({
        data: {
          ...createCaseDto,
          techs:
            typeof createCaseDto.techs === 'string'
              ? (createCaseDto.techs as string).split(',').map((t) => t.trim())
              : createCaseDto.techs,
        },
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Case created successfully.',
        data: createCase,
      };
    } catch {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to create case.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      const cases = await this.prisma.case.findMany();

      return {
        statusCode: HttpStatus.OK,
        message: 'Cases retrieved successfully.',
        data: cases,
      };
    } catch {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve cases.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      const caseData = await this.prisma.case.findUnique({
        where: { id },
      });
      return {
        statusCode: HttpStatus.OK,
        message: `Case with ID ${id} found successfully.`,
        data: caseData,
      };
    } catch {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: `Case with ID ${id} not found.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async update(id: string, updateCaseDto: UpdateCaseDto) {
    try {
      const updatedCase = await this.prisma.case.update({
        where: { id },
        data: {
          ...updateCaseDto,
          techs:
            typeof updateCaseDto.techs === 'string'
              ? (updateCaseDto.techs as string).split(',').map((t) => t.trim())
              : updateCaseDto.techs,
        },
      });
      return {
        statusCode: HttpStatus.OK,
        message: `Case with ID ${id} updated successfully.`,
        data: updatedCase,
      };
    } catch {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: `Case with ID ${id} not found or updated failed.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.case.delete({
        where: { id },
      });

      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `Case with ID ${id} deleted successfully.`,
      };
    } catch {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: `Case with ID ${id} not found or deletion failed.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
