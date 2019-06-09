import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Offer } from './abstracts/Offer';

@Entity()
export class PaymentOffer extends Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  completionComission: number = 0.01;
}
