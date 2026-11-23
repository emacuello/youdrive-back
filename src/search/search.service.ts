import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity.js';
import { Car } from '../cars/entities/car.entity.js';
import { Posts } from '../posts/entities/post.entity.js';
import { JwtService } from '@nestjs/jwt';

import Stripe from 'stripe';

import { NotificationsService } from '../notifications/notifications.service.js';


@Injectable()
export class searchService {
  @InjectRepository(Car) private carRepository: Repository<Car>
  @InjectRepository(Posts) private postsRepository: Repository<Posts>

  async search(query: string) {
    const posts = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.car', 'car') // Incluir la relación con el automóvil
      .where('post.title ILIKE :query', { query: `%${query}%` })
      .orWhere('post.description ILIKE :query', { query: `%${query}%` })
      .orWhere('CAST(post.price AS TEXT) ILIKE :query', { query: `%${query}%` })
      .getMany();

    const cars = await this.carRepository
      .createQueryBuilder('car')
      .where('car.brand ILIKE :query', { query: `%${query}%` })
      .leftJoinAndSelect('car.post', 'post') // Incluir la relación con el automóvil
      .orWhere('car.model ILIKE :query', { query: `%${query}%` })
      .orWhere('CAST(car.year AS TEXT) ILIKE :query', { query: `%${query}%` })
      .orWhere('car.mileage ILIKE :query', { query: `%${query}%` })
      .orWhere('car.color ILIKE :query', { query: `%${query}%` })
      .orWhere('CAST(car.availability AS TEXT) ILIKE :query', { query: `%${query}%` })
      .getMany();

    return {posts, cars}

  }

  

}
