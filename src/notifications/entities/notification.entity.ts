import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Organization } from '../../organizations/entities/organization.entity';
import { NotificationType } from '../../common/enums';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
@Entity('notifications')
export class Notification {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  userId: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  organizationId: string;

  @Field(() => String)
  @Column()
  title: string;

  @Field(() => String)
  @Column('text')
  message: string;

  @Field(() => NotificationType)
  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Field(() => Boolean)
  @Column({ default: false })
  isRead: boolean;

  @Field(() => String, { nullable: true })
  @Column('text', { nullable: true })
  data?: string; // Changed from 'any' to 'string' for GraphQL compatibility

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  actionUrl: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  priority: string;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Field(() => Organization, { nullable: true })
  @ManyToOne(() => Organization, (organization) => organization.users, { nullable: true })
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;
}
