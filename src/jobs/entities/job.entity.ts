import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { RecruiterProfile } from '../../recruiter-profile/entities/recruiter-profile.entity';
import { RTR } from '../../rtr/entities/rtr.entity';
import { JobApplication } from '../../job-applications/entities/job-application.entity';
import { WorkType, JobType, CompensationType, JobStatus } from '../../common/enums';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  company: string;

  @Column('text')
  description: string;

  @Column('simple-array')
  requirements: string[];

  @Column()
  location: string;

  @Column({
    type: 'enum',
    enum: WorkType,
  })
  workType: WorkType;

  @Column({
    type: 'enum',
    enum: JobType,
  })
  jobType: JobType;

  @Column({
    type: 'enum',
    enum: CompensationType,
  })
  compensation: CompensationType;

  @Column({ nullable: true })
  salaryMin: number;

  @Column({ nullable: true })
  salaryMax: number;

  @Column('simple-array')
  benefits: string[];

  @Column()
  recruiterId: string;

  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.ACTIVE,
  })
  status: JobStatus;

  @Column({ nullable: true })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => RecruiterProfile, (recruiter) => recruiter.jobs)
  @JoinColumn({ name: 'recruiterId' })
  recruiter: RecruiterProfile;

  @OneToMany(() => RTR, (rtr) => rtr.job)
  rtrs: RTR[];

  @OneToMany(() => JobApplication, (application) => application.job)
  applications: JobApplication[];
}
