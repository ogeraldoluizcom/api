import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { PrismaService } from '../src/prisma/prisma.service';

jest.setTimeout(60000);

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let container: StartedPostgreSqlContainer;
  let prisma: PrismaService;

  beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:14')
      .withDatabase('api')
      .withUsername('docker')
      .withPassword('docker')
      .start();

    process.env.DATABASE_URL = container.getConnectionUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get(PrismaService);
    await prisma.$connect();
    await app.init();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
    await container.stop();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual({
          status: 'Server is running',
          timestamp: expect.any(String),
        });
      });
  });
});
