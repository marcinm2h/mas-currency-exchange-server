import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { IUser } from './abstracts/IUser';
import { IdentificationDocument } from './IdentificationDocument';
import { Wallet } from './Wallet';
import { PaymentTool } from './abstracts/PaymentTool';
import { Offer } from './abstracts/Offer';

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

  @OneToOne(
    type => IdentificationDocument,
    identificationDocument => identificationDocument.owner, //bi-directional
    { cascade: true } //save/delete/update both on save/delete/update client
  )
  @JoinColumn()
  identificationDocument: IdentificationDocument;

  @OneToMany(type => Wallet, wallet => wallet.owner, { cascade: true })
  wallets: Wallet[];

  @OneToMany(type => PaymentTool, paymentTool => paymentTool.owner, {
    cascade: true
  })
  paymentTools: PaymentTool[];

  @OneToMany(type => Offer, offer => offer.seller, { cascade: true })
  sellOffers: Offer[];

  @OneToMany(type => Offer, offer => offer.buyer, { cascade: true })
  buyOffers: Offer[];

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
