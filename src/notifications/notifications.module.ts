import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service.js';
import { NotificationsController } from './notifications.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity.js';
import { User } from '../users/entities/user.entity.js';
import { MailService } from '../mail/mail.service.js';
import { CronService } from './CronJobs.service.js';
import { UsersModule } from '../users/users.module.js';
import { Rental } from '../rentals/entities/rental.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, User, Rental]),
    UsersModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, MailService, CronService],
})
export class NotificationsModule {}
