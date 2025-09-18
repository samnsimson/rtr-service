import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity';
import { RTR } from '../../rtr/entities/rtr.entity';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
@Entity('rtr_templates')
export class RtrTemplate {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String, { nullable: true, defaultValue: null })
  @Column({ type: 'text', nullable: true, default: null })
  description?: string;

  @Field(() => String, { nullable: true, defaultValue: null })
  @Column({ type: 'text', nullable: true, default: null })
  text?: string;

  @Field(() => String, { nullable: true, defaultValue: null })
  @Column({ type: 'text', nullable: true, default: null })
  html?: string;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @Field(() => Organization)
  @ManyToOne(() => Organization, (organization) => organization.rtrTemplates)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @Field(() => [RTR], { nullable: true })
  @OneToMany('RTR', 'rtrTemplate')
  rtrs: RTR[];

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.createdRtrTemplates)
  @JoinColumn({ name: 'createdBy' })
  author: User;
}
