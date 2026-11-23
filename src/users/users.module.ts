import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { FileUploadService } from '../file-upload/file-upload.service.js';
import { Car } from '../cars/entities/car.entity.js';
import { Address } from '../addresses/entities/address.entity.js';
import { AddressesService } from '../addresses/addresses.service.js';
import { geolocationService } from '../addresses/geolocation.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([User, Car, Address])],
  controllers: [UsersController],
  providers: [
    UsersService,
    FileUploadService,
    AddressesService,
    geolocationService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
