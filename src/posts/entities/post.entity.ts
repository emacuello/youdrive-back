import { Car } from '../../cars/entities/car.entity.js';
import { Chat } from '../../chat/entities/chat.entity.js';
import { Rental } from '../../rentals/entities/rental.entity.js';
import { Review } from '../../reviews/entities/review.entity.js';
import { User } from '../../users/entities/user.entity.js';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn, type Relation } from 'typeorm';

@Entity('posts')
export class Posts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ default: false })
  isDeleted: boolean;

  @OneToMany(() => Chat, (chat) => chat.post)
  room_id: Relation<Chat[]>;

  @ManyToOne(() => User, (user) => user.post)
  @JoinColumn({ name: 'userId' })
  user: Relation<User>;

  @OneToOne(() => Car, { cascade: true })
  @JoinColumn({ name: 'carId' })
  car: Relation<Car>;

  @OneToMany(() => Rental, (rental) => rental.posts)
  rentals: Relation<Rental[]>;

  @CreateDateColumn()
  created_at: Timestamp;

  @UpdateDateColumn()
  updated_at: Timestamp;

  @OneToMany(() => Review, (reviews) => reviews.post,{ cascade: true })
  review: Relation<Review[]>;
}
