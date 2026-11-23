import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service.js';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../users/utils/roles.guard.js';
import { Roles } from '../users/utils/roles.decorator.js';
import { Role } from '../users/utils/roles.enum.js';
import { CustomHeaderGuard } from '../middleweare/protectedEndpoints.guard.js';

@ApiTags('CHAT')
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get(':id/messages')
  @Roles(Role.User, Role.Admin)
  @UseGuards(RolesGuard, CustomHeaderGuard)
  async getChatByRoom_ID(@Param('id') room_id: string) {
    return await this.chatService.findAllByRoom_ID(room_id);
  }
}
