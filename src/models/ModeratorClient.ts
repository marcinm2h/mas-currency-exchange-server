import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IModerator } from './abstracts/IModerator.interface';
import { Client } from './Client';

@Entity()
export class ModeratorClient extends Client implements IModerator {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;
}
