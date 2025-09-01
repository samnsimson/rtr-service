import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { RTR } from '../../rtr/entities/rtr.entity';
import { DocumentType } from '../../common/enums';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
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
