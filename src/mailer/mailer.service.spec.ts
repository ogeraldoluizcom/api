import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from './mailer.service';
import { MailerService as Mailer } from '@nestjs-modules/mailer';

describe('MailerService', () => {
  let service: MailerService;
  let mailerMock: { sendMail: jest.Mock };

  beforeEach(async () => {
    mailerMock = { sendMail: jest.fn().mockResolvedValue('mail sent') };

    const module: TestingModule = await Test.createTestingModule({
      providers: [MailerService, { provide: Mailer, useValue: mailerMock }],
    }).compile();

    service = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send an email with correct params', async () => {
    const name = 'Test User';
    const to = 'test@example.com';
    const subject = 'Test Subject';
    const from = '5efa191681-ab37ba+user1@inbox.mailtrap.io';
    const message = 'Test Body';

    await service.sendEmail({
      name,
      from,
      to,
      subject,
      message: message,
    });

    expect(mailerMock.sendMail).toHaveBeenCalledWith({
      to,
      from: `"${name}" <${from}>`,
      subject,
      text: message,
      html: `
        <div style="font-family: sans-serif; font-size: 14px; line-height: 1.6;">
          <p><strong>De:</strong> ${name} &lt;${from}&gt;</p>
          <p><strong>Mensagem:</strong></p>
          <p>${message}</p>
        </div>
      `,
    });
  });
});
