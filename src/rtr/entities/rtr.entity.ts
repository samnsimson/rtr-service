import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { CandidateProfile } from '../../candidate-profile/entities/candidate-profile.entity';
import { RecruiterProfile } from '../../recruiter-profile/entities/recruiter-profile.entity';
import { Job } from '../../jobs/entities/job.entity';
import { RTRHistory } from '../../rtr-history/entities/rtr-history.entity';
import { Document } from '../../documents/entities/document.entity';
import { User } from '../../users/entities/user.entity';

export enum RTRStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  SENT = 'SENT',
  VIEWED = 'VIEWED',
  SIGNED = 'SIGNED',
  EXPIRED = 'EXPIRED',
  REJECTED = 'REJECTED',
}

@Entity('rtrs')
export class RTR {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  candidateId: string;

  @Column()
  recruiterId: string;

  @Column({ nullable: true })
  jobId: string;

  @Column({
    type: 'enum',
    enum: RTRStatus,
    default: RTRStatus.PENDING,
  })
  status: RTRStatus;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  expiresAt: Date;

  @Column({ nullable: true })
  signedAt: Date;

  @Column({ nullable: true })
  viewedAt: Date;

  @Column({ nullable: true })
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => CandidateProfile, (candidate) => candidate.rtrs)
  @JoinColumn({ name: 'candidateId' })
  candidate: CandidateProfile;

  @ManyToOne(() => RecruiterProfile, (recruiter) => recruiter.rtrs)
  @JoinColumn({ name: 'recruiterId' })
  recruiter: RecruiterProfile;

  @ManyToOne(() => Job, (job) => job.rtrs, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'jobId' })
  job: Job;

  @OneToMany(() => RTRHistory, (history) => history.rtr)
  history: RTRHistory[];

  @OneToMany(() => Document, (document) => document.rtr)
  documents: Document[];

  @ManyToOne(() => User, (user) => user.rtrs)
  @JoinColumn({ name: 'userId' })
  user: User;
}
