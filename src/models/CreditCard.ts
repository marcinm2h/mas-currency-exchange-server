import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentTool } from './abstracts/PaymentTool.abstract';
import { validateCreditCardNumber } from '../validators/validateCreditCardNumber';

@Entity()
export class CreditCard extends PaymentTool {
  @PrimaryGeneratedColumn()
  id: number;

  validate(value?: string): boolean {
    return validateCreditCardNumber(value);
  }
}
