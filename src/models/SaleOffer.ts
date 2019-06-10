import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Offer, OfferType } from './abstracts/Offer';

@Entity()
export class SaleOffer extends Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: OfferType = 'sale';

  @Column()
  completionComission: number = 0.0;
}
