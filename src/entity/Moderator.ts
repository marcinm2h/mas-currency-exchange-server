import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IModerator } from './abstracts/IModerator.interface';

@Entity()
export class Moderator implements IModerator {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;
}
