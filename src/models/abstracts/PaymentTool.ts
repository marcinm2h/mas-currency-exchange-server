import {
  Column,
  ManyToOne,
  OneToMany,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Client } from '../Client';
import { WalletTransaction } from '../WalletTransaction';

@Entity()
export abstract class PaymentTool {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  idNumber: string;

  @ManyToOne(type => Client, client => client.paymentTools)
  owner: Client;

  @OneToMany(
    type => WalletTransaction,
    transaction => transaction.paymentTool,
    { cascade: true }
  )
  transactions: WalletTransaction[];

  abstract validate(value?: string): boolean;
}
