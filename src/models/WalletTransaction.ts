import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
  date: Date;
}
