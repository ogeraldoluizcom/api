import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CasesService } from './cases.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';

@Controller('cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Post()
  async create(@Body() createCaseDto: CreateCaseDto) {
    return this.casesService.create(createCaseDto);
  }

  @Get()
  async findAll() {
    return this.casesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.casesService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCaseDto: UpdateCaseDto) {
    return this.casesService.update(id, updateCaseDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.casesService.remove(id);
  }
}
