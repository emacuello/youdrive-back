import {
  Controller,
  Param,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseInterceptors,
  Post,
  Delete,
  UploadedFiles,
  UseGuards /* UseGuards */,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service.js';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../users/utils/roles.decorator.js';
import { RolesGuard } from '../users/utils/roles.guard.js';
import { Role } from '../users/utils/roles.enum.js';
// import { RolesGuard } from '../users/utils/roles.guard.js';

@ApiTags('FILES')
@Controller('files')
// @UseGuards(RolesGuard)
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('uploadProfilePicture/:id')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePicture(
    @Param('id') userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 200000,
            message: 'La imagen es demasiado grande',
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.fileUploadService.uploadProfilePicture(file, userId);
  }

  @Post('uploadVehicleImages/:id')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(RolesGuard)
  @UseInterceptors(FilesInterceptor('file', 5))
  async uploadVehicleImages(
    @Param('id') vehicleId: string,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 5000000, // 5MB
            message: 'Uno de los archivos es demasiado grande',
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp|mp4|avi|mov)$/,
          }),
        ],
      }),
    )
    files: Express.Multer.File[],
  ) {
    return this.fileUploadService.uploadVehicleImages(vehicleId, files);
  }

  @Delete('deleteImage/:id')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(RolesGuard)
  async deleteImage(@Param('id') publicId: string) {
    return this.fileUploadService.deleteImage(publicId);
  }

  @Delete('deleteVehicleImage/:id')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(RolesGuard)
  async deleteVehicleImage(@Param('id') publicId: string) {
    return this.fileUploadService.deleteVehicleImage(publicId);
  }

  @Post('updateProfilePicture/:id')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateProfilePicture(
    @Param('id') userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 5000000, // 5MB
            message: 'Uno de los archivos es demasiado grande',
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.fileUploadService.updateProfilePicture(userId, file);
  }
}
