import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity("USER")
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;
}
