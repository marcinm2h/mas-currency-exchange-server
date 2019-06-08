import { Column } from 'typeorm';

export abstract class PaymentTool {
  @Column()
  idNumber: string;
  //zwaliduj poprawność numeru() {abstract}
}
