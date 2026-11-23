import { Address } from '../../addresses/entities/address.entity.js';
import { Posts } from '../../posts/entities/post.entity.js';
import { User } from '../../users/entities/user.entity.js';
import {
  Column,
  CreateDateColumn,
  Entity,
  // JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  // OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn, type Relation } from 'typeorm';

@Entity({ name: 'cars' })
export class Car {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  brand: string;

  @Column({ type: 'varchar' })
  model: string;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'varchar' })
  mileage: string;

  @Column({ type: 'varchar' })
  color: string;

  @Column({ type: 'boolean', default: true })
  availability: boolean;

  @Column({
    type: 'varchar',
    array: true,
    default: [
      'https://res.cloudinary.com/dkent00db/image/upload/f_auto,q_auto/v1/image%20car%20placeholder/fpm93xvjp26mpdde0ses',
    ],
  })
  image_url: string[];

  @Column({
    type: 'varchar',
    nullable: true,
    array: true,
  })
  public_id: string[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Timestamp;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Timestamp;

  @Column({ default: false })
  isDeleted: boolean;

  @OneToMany(() => Posts, (post) => post.car)
  post: Relation<Posts[]>;

  // @OneToOne(() => Posts)
  // @JoinColumn()
  // post: Posts;

  @ManyToOne(() => User, (user) => user.car)
  user: Relation<User>;

  @OneToOne(() => Address, (address) => address.car)
  address: Relation<Address>;
  rentals: any;
}
