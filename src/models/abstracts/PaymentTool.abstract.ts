import { Column } from 'typeorm';

export abstract class PaymentTool {
  @Column()
  idNumber: string;

  abstract validate(value?: string): boolean;
}
