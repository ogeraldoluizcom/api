import { Case } from '@prisma/client';

export class CaseEntity implements Case {
  id: string;
  title: string;
  description: string;
  cover: string;
  gallery: string[];
  techs: string[];
  createdAt: Date;
  updatedAt: Date;
}
