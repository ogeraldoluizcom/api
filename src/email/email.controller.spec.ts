import { Test, TestingModule } from '@nestjs/testing';
import { EmailController } from './email.controller';
import { MailerService } from '../mailer/mailer.service';

describe('EmailController', () => {
  let controller: EmailController;
  let mailerService: MailerService;

  beforeEach(async () => {
    const mockMailerService = {
      sendEmail: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailController],
      providers: [{ provide: MailerService, useValue: mockMailerService }],
    }).compile();

    controller = module.get<EmailController>(EmailController);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should send email and return success message', async () => {
    const body = {
      name: 'Contato',
      from: '5efa191681-ab37ba+user1@inbox.mailtrap.io',
      to: 'test@example.com',
      subject: 'Test',
      message: 'Hello',
    };

    const result = await controller.sendEmail(body);

    expect(mailerService.sendEmail).toHaveBeenCalledWith({
      name: body.name,
      from: body.from,
      to: body.to,
      subject: body.subject,
      message: body.message,
    });
    expect(result).toEqual({ message: 'Email sent successfully', status: 201 });
  });
});
