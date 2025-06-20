import { FileFieldsInterceptor } from '@nestjs/platform-express';

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Put,
  UseGuards,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { CasesService } from './cases.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { UploadService } from '../upload/upload.service';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('cases')
export class CasesController {
  constructor(
    private readonly casesService: CasesService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'cover', maxCount: 1 },
      { name: 'gallery', maxCount: 5 },
    ]),
  )
  async create(
    @UploadedFiles()
    files: {
      cover?: Express.Multer.File[];
      gallery?: Express.Multer.File[];
    },
    @Body() body: any,
  ) {
    const dto = plainToInstance(CreateCaseDto, body);

    const cover = files.cover?.[0]
      ? await this.uploadService.uploadFile(files.cover[0])
      : undefined;

    const gallery = files.gallery
      ? await Promise.all(
          files.gallery.map((file) => this.uploadService.uploadFile(file)),
        )
      : [];

    return this.casesService.create({
      ...dto,
      cover,
      gallery,
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.casesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.casesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'cover', maxCount: 1 },
      { name: 'gallery', maxCount: 5 },
    ]),
  )
  async update(
    @Param('id') id: string,
    @UploadedFiles()
    files: {
      cover?: Express.Multer.File[];
      gallery?: Express.Multer.File[];
    },
    @Body() updateCaseDto: UpdateCaseDto,
  ) {
    const dto = plainToInstance(UpdateCaseDto, updateCaseDto);

    const cover = files.cover?.[0]
      ? await this.uploadService.uploadFile(files.cover[0])
      : undefined;

    const gallery = files.gallery
      ? await Promise.all(
          files.gallery.map((file) => this.uploadService.uploadFile(file)),
        )
      : [];

    return this.casesService.update(id, {
      ...dto,
      cover,
      gallery,
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return this.casesService.remove(id);
  }
}
