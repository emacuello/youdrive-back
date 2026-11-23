import { Module } from '@nestjs/common';
import { MailService } from './mail.service.js';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerConfig } from '../config/config.mailer.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rental } from '../rentals/entities/rental.entity.js';
import { Notification } from '../notifications/entities/notification.entity.js';

@Module({
  imports: [
    MailerModule.forRoot(MailerConfig),
    TypeOrmModule.forFeature([Rental, Notification]),
  ],
  providers: [MailService],
  exports: [MailModule],
})
export class MailModule {}
