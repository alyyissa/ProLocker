import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service'; // adjust the path

@Controller('mail')
export class MailController {
  constructor(private mailService: MailService) {}

  @Get('test-email')
  async testEmail() {
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    await this.mailService.sendVerificationEmail('alyy.issa01@gmail.com', code); // replace with your email
    return { message: 'Email sent', code };
  }
}
