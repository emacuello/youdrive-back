import { Module } from '@nestjs/common';
import { AddressesService } from './addresses.service.js';
import { AddressesController } from './addresses.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity.js';
import { User } from '../users/entities/user.entity.js';
import { geolocationService } from './geolocation.service.js';
import { Car } from '../cars/entities/car.entity.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Address, User, Car]), UsersModule],
  controllers: [AddressesController],
  providers: [AddressesService, geolocationService],
})
export class AddressesModule {}
