import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  ParseUUIDPipe,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseInterceptors,
  Headers,
  Query,
  UnauthorizedException,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service.js';
import { CreatePostDto } from './dto/create-post.dto.js';
import { UpdatePostDto } from './dto/update-post.dto.js';
import { FilesInterceptor } from '@nestjs/platform-express';
import type { FiltersPosts } from './interfaces/filter.interfaces.js';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '../users/utils/roles.enum.js';
import { Roles } from '../users/utils/roles.decorator.js';
import { RolesGuard } from '../users/utils/roles.guard.js';
import { CustomHeaderGuard } from '../middleweare/protectedEndpoints.guard.js';
import { RateLimitGuard } from '../common/rate-limit.guard.js';

@ApiTags('POSTS')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPostsAllController(@Headers() headers: any) {
    console.log(headers);
    return this.postsService.getPostsAllServices();
  }

  @Get('filter')
  getPostsByFilter(@Query() filter: FiltersPosts) {
    console.log(filter);
    return this.postsService.getPostsByFilterServices(filter);
  }
  @Get('available')
  getPostsByDate(@Query('location') location: string) {
    return this.postsService.getPostsByDate(location);
  }

  @Get(':id')
  @UseGuards(CustomHeaderGuard)
  getPostsByIdController(@Param('id') id: string) {
    console.log(id);
    return this.postsService.getPostsServiceId(id);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('file', 5))
  @Roles(Role.User, Role.Admin, Role.SuperAdmin)
  @UseGuards(RateLimitGuard, RolesGuard, CustomHeaderGuard)
  create(
    @Body() createPostDto: CreatePostDto,
    @Headers('Authorization') headers?: string,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 5000000, // 5MB
            message: 'Uno de los archivos es demasiado grande',
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png)$/,
          }),
        ],
      }),
    )
    files?: Express.Multer.File[],
  ) {
    console.log(headers);

    if (!headers) {
      throw new UnauthorizedException('token invalido 1');
    }
    const token = headers.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('token invalido 2');
    }
    console.log(files);

    if (files?.length !== 0 || files) {
      return this.postsService.AddPostsServices(createPostDto, token, files);
    }

    return this.postsService.AddPostsServices(createPostDto, token);
  }

  @Post('cancel/:id')
  async cancelReservation(@Param('id') id: string) {
    const cancelPost = await this.postsService.cancel(id);
    return cancelPost;
  }

  @ApiBearerAuth()
  @Put(':id')
  @UseInterceptors(FilesInterceptor('file', 5))
  @Roles(Role.User, Role.Admin)
  @UseGuards(RateLimitGuard, RolesGuard, CustomHeaderGuard)
  putPostsById(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Headers('Authorization') headers: string,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 5000000, // 5MBa
            message: 'Uno de los archivos es demasiado grande',
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp|mp4|avi|mov)$/,
          }),
        ],
        fileIsRequired: false,
      }),
    )
    files?: Express.Multer.File[],
  ) {
    if (!headers) {
      throw new UnauthorizedException('token invalido 1');
    }
    const token = headers.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('token invalido 2');
    }

    if (files?.length !== 0 || files) {
      return this.postsService.UpdatePostsServices(
        id,
        updatePostDto,
        token,
        files,
      );
    }
    console.log(updatePostDto);
    return this.postsService.UpdatePostsServices(id, updatePostDto, token);
  }

  @Patch('soft-delete/:id')
  @Roles(Role.SuperAdmin)
  @UseGuards(RolesGuard, CustomHeaderGuard)
  async softDelete(@Param('id') id: string): Promise<{ message: string }> {
    return this.postsService.softDelete(id);
  }
}
