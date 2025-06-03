import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { MailerService } from '../mailer/mailer.service';
import { SendEmailDto } from './dto/send-email.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly mailer: MailerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async sendEmail(
    @Body()
    body: SendEmailDto,
  ) {
    await this.mailer.sendEmail(body);

    return {
      message: 'Email sent successfully',
      status: HttpStatus.CREATED,
    };
  }
}
