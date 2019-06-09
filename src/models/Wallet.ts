import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany
} from 'typeorm';
import { Client } from './Client';
import { Currency } from './Currency';
import { WalletTransaction } from './WalletTransaction';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  balance: number = 0;

  @ManyToOne(type => Client, client => client.wallets)
  owner: Client;

  @ManyToOne(type => Currency, currency => currency.wallets)
  currency: Currency;

  @OneToMany(type => WalletTransaction, transaction => transaction.wallet, {
    cascade: true
  })
  transactions: WalletTransaction[];
}
