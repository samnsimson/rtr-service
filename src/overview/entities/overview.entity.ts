import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity';

@ObjectType()
@Entity('overviews')
export class Overview {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  organizationId: string;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @Field(() => Organization)
  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;
  @Field(() => Int, { description: 'Total number of RTRs' })
  @Column({ default: 0 })
  totalRtrs: number;

  @Field(() => Int, { description: 'Number of pending RTRs' })
  @Column({ default: 0 })
  pendingRtrs: number;

  @Field(() => Int, { description: 'Number of signed RTRs' })
  @Column({ default: 0 })
  signedRtrs: number;

  @Field(() => Int, { description: 'Number of expired RTRs' })
  @Column({ default: 0 })
  expiredRtrs: number;

  @Field(() => Int, { description: 'Number of rejected RTRs' })
  @Column({ default: 0 })
  rejectedRtrs: number;

  @Field(() => Int, { description: 'Total number of candidates' })
  @Column({ default: 0 })
  totalCandidates: number;

  @Field(() => Int, { description: 'Total number of recruiters' })
  @Column({ default: 0 })
  totalRecruiters: number;

  @Field(() => Int, { description: 'Total number of organizations' })
  @Column({ default: 0 })
  totalOrganizations: number;

  @Field(() => Int, { description: 'Total number of jobs' })
  @Column({ default: 0 })
  totalJobs: number;

  @Field(() => Int, { description: 'Number of active jobs' })
  @Column({ default: 0 })
  activeJobs: number;

  @Field(() => Int, { description: 'Number of closed jobs' })
  @Column({ default: 0 })
  closedJobs: number;

  @Field(() => Int, { description: 'Total number of job applications' })
  @Column({ default: 0 })
  totalJobApplications: number;

  @Field(() => Int, { description: 'Number of applications under review' })
  @Column({ default: 0 })
  reviewingApplications: number;

  @Field(() => Int, { description: 'Number of applications in interview stage' })
  @Column({ default: 0 })
  interviewingApplications: number;

  @Field(() => Int, { description: 'Number of accepted applications' })
  @Column({ default: 0 })
  acceptedApplications: number;

  @Field(() => Int, { description: 'Number of rejected applications' })
  @Column({ default: 0 })
  rejectedApplications: number;

  @Field(() => Int, { description: 'Total number of users' })
  @Column({ default: 0 })
  totalUsers: number;

  @Field(() => Int, { description: 'RTRs created this month' })
  @Column({ default: 0 })
  rtrsThisMonth: number;

  @Field(() => Int, { description: 'Jobs created this month' })
  @Column({ default: 0 })
  jobsThisMonth: number;

  @Field(() => Int, { description: 'Applications this month' })
  @Column({ default: 0 })
  applicationsThisMonth: number;
}
