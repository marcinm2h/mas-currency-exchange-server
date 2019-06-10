import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Offer, OfferType } from './abstracts/Offer';

@Entity()
export class PurchaseOffer extends Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: OfferType = 'purchase';

  @Column()
  completionComission: number = 0.0;
}
