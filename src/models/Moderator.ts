import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IUser } from './abstracts/IUser';
import { IModerator } from './abstracts/IModerator';

@Entity()
export class Moderator implements IUser, IModerator {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;

  @Column()
  password: string;
}
