import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigModule } from '@nestjs/config';
import { MailController } from './mail.controller';

@Module({
  providers: [MailService],
  imports:[ConfigModule],
  exports:[MailService],
  controllers: [MailController]
})
export class MailModule {}
