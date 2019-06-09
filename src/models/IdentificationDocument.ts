import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type DocumentType = 'passport' | 'id-card';

@Entity()
export class IdentificationDocument {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  idNumber: string;

  @Column()
  type: DocumentType;

  @Column()
  scannedDocumentUrl: string = '';
}
