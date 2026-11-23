import { Address } from '../../addresses/entities/address.entity.js';
import { Car } from '../../cars/entities/car.entity.js';
import { Notification } from '../../notifications/entities/notification.entity.js';
import { Posts } from '../../posts/entities/post.entity.js';
import { Rental } from '../../rentals/entities/rental.entity.js';
import { Review } from '../../reviews/entities/review.entity.js';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToMany, type Relation } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  password: string;

  @Column({ default: 5 })
  points: number;

  @Column({ type: 'int', nullable: true })
  nDni: number;

  @Column({ nullable: true })
  rExpiration: string;

  @Column({ type: 'bigint', nullable: true })
  phone: number;

  @Column({
    default:
      'https://res.cloudinary.com/dkent00db/image/upload/v1717555619/image%20profile%20picture%20placeholder/vqnmnefzjwscrtkfpxtw.webp',
  })
  image_url: string;

  @Column({
    nullable: true,
  })
  public_id: string;

  @Column({ default: false })
  userGoogle: boolean;

  @Column({ type: 'text', nullable: true })
  aboutMe: string;

  @Column({ default: 'user' })
  roles: string;

  @Column({ default: false })
  isDeleted: boolean;

  @ManyToMany(() => Rental, (rental) => rental.users)
  rentals: Relation<Rental[]>;

  @OneToMany(() => Notification, (notification) => notification.user, {
    cascade: true,
  })
  @JoinColumn()
  notifications: Relation<Notification[]>;

  @OneToMany(() => Address, (address) => address.user, {
    cascade: true,
  })
  @JoinColumn()
  addresses: Relation<Address[]>;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  //Para la tablar User desde Posts:
  @OneToMany(() => Posts, (post) => post.user)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  post: Relation<Posts[]>;

  @OneToMany(() => Car, (car) => car.user)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  car: Relation<Car>;

  @OneToMany(() => Review, (review) => review.user)
  reviews: Relation<Review[]>;
}
