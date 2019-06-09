import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany
} from 'typeorm';
import { Wallet } from './Wallet';
import { Offer } from './abstracts/Offer';

@Entity()
export class Currency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  symbol: string;

  @OneToMany(type => Wallet, wallet => wallet.currency, { cascade: true })
  wallets: Wallet[];

  @OneToMany(type => Offer, offer => offer.fromCurrency, { cascade: true })
  offersFrom: Currency;

  @OneToMany(type => Offer, offer => offer.toCurrency, { cascade: true })
  offersTo: Currency;
}
