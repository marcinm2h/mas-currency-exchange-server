import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;

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
