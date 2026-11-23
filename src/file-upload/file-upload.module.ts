import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service.js';
import { FileUploadController } from './file-upload.controller.js';
import { CloudinaryConfig } from '../config/config.cloudinary.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from '../cars/entities/car.entity.js';
import { User } from '../users/entities/user.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Car, User])],
  controllers: [FileUploadController],
  providers: [FileUploadService, CloudinaryConfig],
})
export class FileUploadModule {}
