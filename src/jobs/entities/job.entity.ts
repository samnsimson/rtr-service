import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { RecruiterProfile } from '../../recruiter-profile/entities/recruiter-profile.entity';
import { Organization } from '../../organizations/entities/organization.entity';
import { RTR } from '../../rtr/entities/rtr.entity';
import { JobApplication } from '../../job-applications/entities/job-application.entity';
import { WorkType, JobType, CompensationType, JobStatus } from '../../common/enums';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
@Entity('jobs')
export class Job {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  title: string;

  @Field(() => String)
  @Column()
  company: string;

  @Field(() => String)
  @Column('text')
  description: string;

  @Field(() => [String])
  @Column('simple-array')
  requirements: string[];

  @Field(() => String)
  @Column()
  location: string;

  @Field(() => WorkType)
  @Column({
    type: 'enum',
    enum: WorkType,
  })
  workType: WorkType;

  @Field(() => JobType)
  @Column({
    type: 'enum',
    enum: JobType,
  })
  jobType: JobType;

  @Field(() => CompensationType)
  @Column({
    type: 'enum',
    enum: CompensationType,
  })
  compensation: CompensationType;

  @Field(() => Number, { nullable: true })
  @Column({ nullable: true })
  salaryMin: number;

  @Field(() => Number, { nullable: true })
  @Column({ nullable: true })
  salaryMax: number;

  @Field(() => [String])
  @Column('simple-array')
  benefits: string[];

  @Field(() => String)
  @Column()
  recruiterId: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  organizationId: string;

  @Field(() => JobStatus)
  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.ACTIVE,
  })
  status: JobStatus;

  @Field(() => Date, { nullable: true })
  @Column({ nullable: true })
  expiresAt: Date;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @Field(() => RecruiterProfile)
  @ManyToOne(() => RecruiterProfile, (recruiter) => recruiter.jobs)
  @JoinColumn({ name: 'recruiterId' })
  recruiter: RecruiterProfile;

  @Field(() => Organization, { nullable: true })
  @ManyToOne(() => Organization, (organization) => organization.jobs, { nullable: true })
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @Field(() => [RTR], { nullable: true })
  @OneToMany(() => RTR, (rtr) => rtr.job)
  rtrs: RTR[];

  @Field(() => [JobApplication], { nullable: true })
  @OneToMany(() => JobApplication, (application) => application.job)
  applications: JobApplication[];
}
