import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn
} from 'typeorm';
import { IUser } from './abstracts/IUser';
import { IdentificationDocument } from './IdentificationDocument';

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

  @Column({ nullable: true })
  mail: string;

  @Column({ nullable: true })
  contactAddress: string;

  @OneToOne(type => IdentificationDocument)
  @JoinColumn()
  identificationDocument: IdentificationDocument;

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
