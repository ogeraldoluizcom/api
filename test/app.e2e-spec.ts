import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual({
          status: 'Server is running',
          timestamp: expect.any(String), // Verifica se o timestamp é uma string
        });
      });
  });

  it('/email (POST)', async () => {
    const emailPayload = {
      name: 'Test User',
      from: 'janedoe@email.com',
      to: 'test@example.com',
      subject: 'Test Subject',
      message: 'Test email body',
    };

    const response = await request(app.getHttpServer())
      .post('/email')
      .send(emailPayload)
      .expect(201);

    expect(response.body).toEqual({
      message: 'Email sent successfully',
      status: 201,
    });
  });
});
