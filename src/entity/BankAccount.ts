import { PaymentTool } from './abstracts/PaymentTool.abstract';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BankAccount extends PaymentTool {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bankCode: string;

  @Column()
  bankName: string;

  //zwaliduj poprawność numeru()
}
