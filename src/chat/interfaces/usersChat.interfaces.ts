import { User } from '../../users/entities/user.entity.js';

export interface ChatClient {
  to: string;
  message: string;
}

export interface MessageChat {
  sender: Partial<User>;
  receiver: Partial<User>;
  message: string;
  room_id: string;
  image?: string;
  date_created?: Date;
}
