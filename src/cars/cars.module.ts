import { Module } from '@nestjs/common';
import { CarsService } from './cars.service.js';
import { CarsController } from './cars.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './entities/car.entity.js';
import { FileUploadService } from '../file-upload/file-upload.service.js';
import { User } from '../users/entities/user.entity.js';
import { Posts } from '../posts/entities/post.entity.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Car, User, Posts]), UsersModule],
  controllers: [CarsController],
  providers: [CarsService, FileUploadService],
})
export class CarsModule {}
