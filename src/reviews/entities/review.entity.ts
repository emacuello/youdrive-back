// import { Car } from '../../cars/entities/car.entity.js';
import { Posts } from '../../posts/entities/post.entity.js';
import { User } from '../../users/entities/user.entity.js';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, /* OneToMany, */ PrimaryGeneratedColumn, Timestamp, UpdateDateColumn, type Relation } from 'typeorm';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: false })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @CreateDateColumn()
  created_at: Timestamp;

  @UpdateDateColumn()
  updated_at: Timestamp;

  @ManyToOne(() => User, (user) => user.reviews, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: Relation<User>;


  @ManyToOne(() => Posts, (posts) => posts.review, { eager: true})
  @JoinColumn({ name: 'postId' })
  post: Relation<Posts>;


}
