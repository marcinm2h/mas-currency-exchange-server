import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentTool } from './abstracts/PaymentTool';
import { validateAccountNumber } from '../validators/validateAccountNumber';

@Entity()
export class BankAccount extends PaymentTool {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  bankCode: string;

  @Column({ nullable: true })
  bankName: string;

  validate(value?: string): boolean {
    return validateAccountNumber(value);
  }
}
