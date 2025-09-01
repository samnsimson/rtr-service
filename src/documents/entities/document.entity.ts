import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { RTR } from '../../rtr/entities/rtr.entity';

export enum DocumentType {
  RTR_FORM = 'RTR_FORM',
  RESUME = 'RESUME',
  COVER_LETTER = 'COVER_LETTER',
  CONTRACT = 'CONTRACT',
  OTHER = 'OTHER',
}

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  rtrId: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: DocumentType,
  })
  type: DocumentType;

  @Column()
  url: string;

  @Column()
  size: number; // File size in bytes

  @Column()
  mimeType: string;

  @CreateDateColumn()
  uploadedAt: Date;

  // Relations
  @ManyToOne(() => RTR, (rtr) => rtr.documents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'rtrId' })
  rtr: RTR;
}
