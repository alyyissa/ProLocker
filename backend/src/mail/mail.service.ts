import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
        service: 'hotmail',
      host: 'smtp-mail.outlook.com', // Hotmail/Outlook SMTP
      port: 587,                  // TLS
      secure: false,              // must be false for port 587
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'), // app password
      },
    });
  }

  async sendVerificationEmail(to: string, code: string) {
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to,
      subject: 'Your Verification Code',
      text: `Your 6-digit verification code is: ${code}`,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
