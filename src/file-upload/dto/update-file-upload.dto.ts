import { PartialType } from '@nestjs/mapped-types';
import { CreateFileUploadDto } from './create-file-upload.dto.js';

export class UpdateFileUploadDto extends PartialType(CreateFileUploadDto) {}
