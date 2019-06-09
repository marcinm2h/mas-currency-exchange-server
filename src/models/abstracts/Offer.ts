import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Currency } from '../Currency';
import { Client } from '../Client';

export type OfferStatus = 'new' | 'rejected' | 'completed' | 'archived';

@Entity()
export abstract class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: OfferStatus = 'new';

  @ManyToOne(type => Currency, currency => currency.offersFrom)
  fromCurrency: Currency;

  @ManyToOne(type => Currency, currency => currency.offersTo)
  toCurrency: Currency;

  @ManyToOne(type => Client, client => client.sellOffers)
  seller: Client;

  @ManyToOne(type => Client, client => client.buyOffers)
  buyer: Client;

  static issuingComission: number = 0.01;

  // wyświetl()
  // oblicz koszt dodania()
  // wylistuj oferty()
}
