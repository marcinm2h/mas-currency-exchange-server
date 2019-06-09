import { Column } from 'typeorm';

export type OfferStatus = 'new' | 'rejected' | 'completed' | 'archived';

export abstract class Offer {
  @Column()
  status: OfferStatus = 'new';

  static issuingComission: number = 0.01;

  // wyświetl()
  // oblicz koszt dodania()
  // wylistuj oferty()
}
