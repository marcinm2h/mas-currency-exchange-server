import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IUser } from './abstracts/IUser';
import { IModerator } from './abstracts/IModerator';
import { Client } from './Client';

@Entity()
export class ModeratorClient extends Client implements IUser, IModerator {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;

  @Column()
  password: string;
}
