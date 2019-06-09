import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne
} from 'typeorm';
import { PaymentTool } from './abstracts/PaymentTool';
import { Wallet } from './Wallet';

export type TransactionType = 'deposit' | 'withdrawal' | 'ghost';
export type TransactionState =
  | 'new'
  | 'in-progress'
  | 'rejected'
  | 'accepted'
  | 'canceled';

@Entity()
export class WalletTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;

  @Column()
  type: TransactionType;

  @Column()
  state: TransactionState;

  @Column()
  @CreateDateColumn()
  date: Date;

  @ManyToOne(type => PaymentTool, paymentTool => paymentTool.transactions)
  paymentTool: PaymentTool;

  @ManyToOne(type => Wallet, wallet => wallet.transactions)
  wallet: Wallet;
}
