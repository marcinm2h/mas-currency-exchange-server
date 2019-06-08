import { Column } from 'typeorm';

export type OfferStatus = 'new' | 'rejected' | 'completed' | 'archived';

export abstract class Offer {
  @Column()
  status: OfferStatus;

  static issuingComission: number;

  // wyświetl()
  // oblicz koszt dodania()
  // wylistuj oferty()
}
