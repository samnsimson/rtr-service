import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Job } from '../../jobs/entities/job.entity';
import { CandidateProfile } from '../../candidate-profile/entities/candidate-profile.entity';
import { Organization } from '../../organizations/entities/organization.entity';
import { ApplicationStatus } from '../../common/enums';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
@Entity('job_applications')
@Index(['jobId', 'candidateId'], { unique: true })
export class JobApplication {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  jobId: string;

  @Field(() => String)
  @Column()
  candidateId: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  organizationId: string;

  @Field(() => ApplicationStatus)
  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.APPLIED,
  })
  status: ApplicationStatus;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  coverLetter: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  notes: string;

  @Field(() => Date)
  @CreateDateColumn()
  appliedAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @Field(() => Job)
  @ManyToOne(() => Job, (job) => job.applications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'jobId' })
  job: Job;

  @Field(() => CandidateProfile)
  @ManyToOne(() => CandidateProfile, (candidate) => candidate.applications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'candidateId' })
  candidate: CandidateProfile;

  @Field(() => Organization, { nullable: true })
  @ManyToOne(() => Organization, (organization) => organization.users, { nullable: true })
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;
}
