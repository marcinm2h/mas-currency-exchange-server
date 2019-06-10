import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { IUser } from './abstracts/IUser';
import { IdDocument } from './IdDocument';
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
    type => IdDocument,
    idDocument => idDocument.owner, //bi-directional
    { cascade: true } //save/delete/update both on save/delete/update client
  )
  @JoinColumn()
  idDocument: IdDocument;

  @OneToMany(type => Wallet, wallet => wallet.owner, { cascade: true })
  wallets: Wallet[];

  @OneToMany(type => PaymentTool, paymentTool => paymentTool.owner, {
    cascade: true
  })
  paymentTools: PaymentTool[];

  @OneToMany(type => Offer, offer => offer.participant, { cascade: true })
  participatedOffers: Offer[];

  @OneToMany(type => Offer, offer => offer.owner, { cascade: true })
  ownOffers: Offer[];

  static minimalAge: number = 18;
}
