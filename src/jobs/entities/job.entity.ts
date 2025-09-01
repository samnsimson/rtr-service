import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { RecruiterProfile } from '../../recruiter-profile/entities/recruiter-profile.entity';
import { RTR } from '../../rtr/entities/rtr.entity';
import { JobApplication } from '../../job-applications/entities/job-application.entity';

export enum WorkType {
  REMOTE = 'REMOTE',
  HYBRID = 'HYBRID',
  ON_SITE = 'ON_SITE',
}

export enum JobType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  INTERNSHIP = 'INTERNSHIP',
  FREELANCE = 'FREELANCE',
}

export enum CompensationType {
  SALARY = 'SALARY',
  HOURLY = 'HOURLY',
  PROJECT_BASED = 'PROJECT_BASED',
  COMMISSION = 'COMMISSION',
}

export enum JobStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  CLOSED = 'CLOSED',
  DRAFT = 'DRAFT',
}

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
