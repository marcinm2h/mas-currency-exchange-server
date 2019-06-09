import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Offer } from './abstracts/Offer.abstract';

@Entity()
export class PurchaseOffer extends Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  completionComission: number;
}