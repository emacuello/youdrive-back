import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, type Relation } from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { Posts } from '../../posts/entities/post.entity.js';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE', cascade: true })
  sender: Relation<User>;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE', cascade: true })
  receiver: Relation<User>;

  @ManyToOne(() => Posts, (post) => post.room_id, {
    onDelete: 'CASCADE',
  })
  post: Relation<Posts>;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'varchar', nullable: true })
  image: string;

  @Column({ type: 'varchar' })
  room_id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_created: Date;
}
