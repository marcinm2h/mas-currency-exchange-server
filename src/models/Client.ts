import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IUser } from './abstracts/IUser';

@Entity()
export class Client implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  birthday: Date;

  @Column()
  PESEL: string;

  @Column()
  mail: string;

  @Column()
  contactAddress: string;

  static minimalAge: number = 18;

  // wpłać środki()
  // wypłać środki()
  // dodaj ofertę()
  // zaakceptuj ofertę()
  // usuń ofertę ()
  // dodaj narzędzie płatności()
  // usuń narzędzie płatnośći()
  // wylistuj użytkowników()
}
