import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentalsService } from './rentals.service.js';
import { RentalsController } from './rentals.controller.js';
import { Rental } from './entities/rental.entity.js';
import { User } from '../users/entities/user.entity.js';
import { Car } from '../cars/entities/car.entity.js';
import { Posts } from '../posts/entities/post.entity.js';
import { UsersModule } from '../users/users.module.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { Notification } from '../notifications/entities/notification.entity.js';
import { MailService } from '../mail/mail.service.js';
import { ScheduleModule } from '@nestjs/schedule';
import { RentalPrev } from './entities/rentalPrev.entity.js';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Rental,
      User,
      Car,
      Posts,
      Notification,
      RentalPrev,
    ]),
    ScheduleModule.forRoot(),
    UsersModule,
  ],
  providers: [RentalsService, NotificationsService, MailService],
  controllers: [RentalsController],
})
export class RentalsModule {}
