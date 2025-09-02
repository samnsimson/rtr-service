import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Organization } from '../../organizations/entities/organization.entity';
import { Job } from '../../jobs/entities/job.entity';
import { RTR } from '../../rtr/entities/rtr.entity';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
@Entity('recruiter_profiles')
export class RecruiterProfile {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column({ unique: true })
  userId: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  title: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  bio: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  linkedinUrl: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  avatar: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  organizationId: string | null;

  @Field(() => Boolean)
  @Column({ default: true })
  isActive: boolean;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @Field(() => User)
  @OneToOne(() => User, (user) => user.recruiterProfile)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Field(() => Organization, { nullable: true })
  @ManyToOne(() => Organization, (organization) => organization.recruiterProfiles, { nullable: true })
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @Field(() => [Job], { nullable: true })
  @OneToMany(() => Job, (job) => job.recruiter)
  jobs: Job[];

  @Field(() => [RTR], { nullable: true })
  @OneToMany(() => RTR, (rtr) => rtr.recruiter)
  rtrs: RTR[];
}
