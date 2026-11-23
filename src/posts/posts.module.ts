import { Module } from '@nestjs/common';
import { PostsService } from './posts.service.js';
import { PostsController } from './posts.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from './entities/post.entity.js';

import { Car } from '../cars/entities/car.entity.js';
import { User } from '../users/entities/user.entity.js';
import { CarsService } from '../cars/cars.service.js';
import { FileUploadService } from '../file-upload/file-upload.service.js';
import { CloudinaryConfig } from '../config/config.cloudinary.js';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module.js';
import { Review } from '../reviews/entities/review.entity.js';
import { Rental } from '../rentals/entities/rental.entity.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { MailService } from '../mail/mail.service.js';
import { Notification } from '../notifications/entities/notification.entity.js';
import { Address } from '../addresses/entities/address.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Posts,
      Car,
      User,
      Review,
      Rental,
      Notification,
      Address,
    ]),
    UsersModule,
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    CarsService,
    FileUploadService,
    CloudinaryConfig,
    JwtService,
    NotificationsService,
    MailService,
  ],
})
export class PostsModule {}
