import { Module } from '@nestjs/common';
import { ChatService } from './chat.service.js';
import { ChatGateway } from './chat.gateway.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity.js';
import { User } from '../users/entities/user.entity.js';
import { Posts } from '../posts/entities/post.entity.js';
import { ChatController } from './chat.controller.js';
import { UsersModule } from '../users/users.module.js';
import { MailService } from '../mail/mail.service.js';
import { Rental } from '../rentals/entities/rental.entity.js';
import { Notification } from '../notifications/entities/notification.entity.js';

@Module({
  controllers: [ChatController],
  imports: [
    TypeOrmModule.forFeature([Chat, User, Posts, Rental, Notification]),
    UsersModule,
  ],
  providers: [ChatGateway, ChatService, MailService],
})
export class ChatModule {}
