import { User } from '../../users/entities/user.entity.js';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn, type Relation } from 'typeorm';

@Entity({
  name: 'notifications',
})
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  template_message: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;
}
