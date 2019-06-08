import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentTool } from './abstracts/PaymentTool.abstract';
import { validateAccountNumber } from '../validators/validateAccountNumber';

@Entity()
export class BankAccount extends PaymentTool {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bankCode: string;

  @Column()
  bankName: string;

  validate(value?: string): boolean {
    return validateAccountNumber(value);
  }
}
