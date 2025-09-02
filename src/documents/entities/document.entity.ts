import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { RTR } from '../../rtr/entities/rtr.entity';
import { User } from '../../users/entities/user.entity';
import { Organization } from '../../organizations/entities/organization.entity';
import { DocumentType } from '../../common/enums';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
@Entity('documents')
export class Document {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  rtrId: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  userId: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  organizationId: string;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => DocumentType)
  @Column({
    type: 'enum',
    enum: DocumentType,
  })
  type: DocumentType;

  @Field(() => String)
  @Column()
  url: string;

  @Field(() => Number)
  @Column()
  size: number; // File size in bytes

  @Field(() => String)
  @Column()
  mimeType: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  description: string;

  @Field(() => Boolean)
  @Column({ default: true })
  isActive: boolean;

  @Field(() => Date)
  @CreateDateColumn()
  uploadedAt: Date;

  // Relations
  @Field(() => RTR)
  @ManyToOne(() => RTR, (rtr) => rtr.documents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'rtrId' })
  rtr: RTR;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.notifications, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Field(() => Organization, { nullable: true })
  @ManyToOne(() => Organization, (organization) => organization.users, { nullable: true })
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;
}
