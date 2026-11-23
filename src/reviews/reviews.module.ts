import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service.js';
import { ReviewsController } from './reviews.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from '../posts/entities/post.entity.js';
import { Review } from './entities/review.entity.js';
import { User } from '../users/entities/user.entity.js';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, Review, User]), UsersModule],
  controllers: [ReviewsController],
  providers: [
    ReviewsService,
    JwtService,
  ],
})
export class ReviewsModule {}
