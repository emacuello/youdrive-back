import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity.js';
import { Address } from '../addresses/entities/address.entity.js';
import { GoogleStrategy } from './utils/GoogleStrategy.js';
import { SessionSerializer } from './utils/Serializer.js';
import { Notification } from '../notifications/entities/notification.entity.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { MailService } from '../mail/mail.service.js';
import { AddressesService } from '../addresses/addresses.service.js';
import { Car } from '../cars/entities/car.entity.js';
import { geolocationService } from '../addresses/geolocation.service.js';
import { UsersModule } from '../users/users.module.js';
import { Rental } from '../rentals/entities/rental.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Address, Notification, Car, Rental]),
    UsersModule,
  ],
  providers: [
    AuthService,
    NotificationsService,
    MailService,
    GoogleStrategy,
    SessionSerializer,
    AddressesService,
    geolocationService,
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
