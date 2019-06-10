import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Client } from './Client';

export type DocumentType = 'passport' | 'id-card';

@Entity()
export class IdDocument {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  idNumber: string;

  @Column()
  type: DocumentType;

  @Column()
  scannedDocumentUrl: string = '';

  @OneToOne(type => Client, client => client.idDocument)
  owner: Client;
}
