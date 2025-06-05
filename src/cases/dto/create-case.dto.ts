import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCaseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
