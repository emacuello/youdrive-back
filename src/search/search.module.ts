import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Car } from '../cars/entities/car.entity.js';
import { Posts } from '../posts/entities/post.entity.js';
// import { UsersModule } from '../users/users.module.js';
// import { NotificationsService } from '../notifications/notifications.service.js';
// import { Notification } from '../notifications/entities/notification.entity.js';
// import { MailService } from '../mail/mail.service.js';
import { ScheduleModule } from '@nestjs/schedule';

import { searchService } from './search.service.js';
import { searchController } from './search.controller.js';
@Module({
  imports: [
    TypeOrmModule.forFeature([

      Car,
      Posts,
      // Notification,

    ]),
    ScheduleModule.forRoot(),
    // UsersModule,
  ],
  providers: [searchService, 
    // NotificationsService, 
    // MailService
  ],
  controllers: [searchController],
})
export class searchModule {}
