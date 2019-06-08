import { PaymentTool } from './abstracts/PaymentTool.abstract';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CreditCard extends PaymentTool {
  @PrimaryGeneratedColumn()
  id: number;

  //zwaliduj poprawność numeru()
}
