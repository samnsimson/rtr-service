import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { RTR } from '../../rtr/entities/rtr.entity';
import { User } from '../../users/entities/user.entity';
import { Organization } from '../../organizations/entities/organization.entity';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
@Entity('rtr_history')
export class RTRHistory {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  rtrId: string;

  @Field(() => String)
  @Column()
  userId: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  organizationId: string;

  @Field(() => String)
  @Column()
  action: string; // e.g., "created", "sent", "viewed", "signed", "expired"

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  details: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  ipAddress: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  userAgent: string;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @Field(() => RTR)
  @ManyToOne(() => RTR, (rtr) => rtr.history, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'rtrId' })
  rtr: RTR;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.rtrHistory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Field(() => Organization, { nullable: true })
  @ManyToOne(() => Organization, (organization) => organization.users, { nullable: true })
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;
}
