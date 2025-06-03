import { Injectable } from '@nestjs/common';
import { MailerService as Mailer } from '@nestjs-modules/mailer';

import { SendEmailDto } from '../email/dto/send-email.dto';

@Injectable()
export class MailerService {
  constructor(private readonly mailer: Mailer) {}

  async sendEmail({ name, from, to, subject, message }: SendEmailDto) {
    return this.mailer.sendMail({
      to,
      from: `"${name}" <${from}>`,
      subject,
      text: message,
      html: `
        <div style="font-family: sans-serif; font-size: 14px; line-height: 1.6;">
          <p><strong>De:</strong> ${name} &lt;${from}&gt;</p>
          <p><strong>Mensagem:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
      `,
    });
  }
}
