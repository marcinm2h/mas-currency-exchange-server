import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Currency } from '../Currency';
import { Client } from '../Client';

export type OfferStatus = 'new' | 'rejected' | 'completed' | 'archived';
export type OfferType = 'purchase' | 'sale';

@Entity()
export abstract class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: OfferType;

  @Column()
  status: OfferStatus = 'new';

  @Column()
  fromAmount: number;

  @Column()
  toAmount: number;

  @ManyToOne(type => Currency, currency => currency.offersFrom)
  fromCurrency: Currency;

  @ManyToOne(type => Currency, currency => currency.offersTo)
  toCurrency: Currency;

  @ManyToOne(type => Client, client => client.participatedOffers)
  participant: Client;

  @ManyToOne(type => Client, client => client.ownOffers)
  owner: Client;

  static issuingComission: number = 0.0;
}
