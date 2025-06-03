import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as request from 'supertest';

import { AppModule } from './../src/app.module';
import { mailerServiceMock } from './mocks/mailer.service.mock';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    // Fecha a aplicação Nest
    await app.close();

    // Fecha a conexão do MailerService, se necessário
    const mailer = app.get(MailerService);
    if (mailer && typeof mailer['transport']?.close === 'function') {
      await mailer['transport'].close();
    }
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

    expect(mailerServiceMock.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'test@example.com',
        subject: 'Test Subject',
        html: expect.any(String),
      }),
    );
  });
});
