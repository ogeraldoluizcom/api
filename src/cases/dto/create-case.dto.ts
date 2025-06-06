import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateCaseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  cover?: string;

  @IsArray()
  gallery?: string[];

  @IsArray()
  techs: string[];
}
