import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerModule as MailModule } from '@nestjs-modules/mailer';
import { MailerService } from './mailer.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailModule.forRoot({
      transport: {
        host: process.env.MAILTRAP_HOST || 'sandbox.smtp.mailtrap.io',
        port: 2525,
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PASS,
        },
      },
    }),
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
