import { Case } from '@prisma/client';

export class CaseEntity implements Case {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
