import { Car } from '../../cars/entities/car.entity.js';
import { User } from '../../users/entities/user.entity.js';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn, type Relation } from 'typeorm';

@Entity({
  name: 'addresses',
})
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  address: string;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  city: string;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  state: string;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  country: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  zip_code: string;

  @Column({
    type: 'decimal',
    precision: 9,
    scale: 6,
    nullable: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  latitude: number;

  @Column({
    type: 'decimal',
    precision: 9,
    scale: 6,
    nullable: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  longitude: number;

  @ManyToOne(() => User, (user) => user.addresses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @OneToOne(() => Car, (car) => car.address)
  @JoinColumn()
  car: Relation<Car>;
}
