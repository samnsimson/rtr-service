import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { CandidateProfile } from '../../candidate-profile/entities/candidate-profile.entity';
import { RecruiterProfile } from '../../recruiter-profile/entities/recruiter-profile.entity';
import { Organization } from '../../organizations/entities/organization.entity';
import { Job } from '../../jobs/entities/job.entity';
import { RTRHistory } from '../../rtr-history/entities/rtr-history.entity';
import { Document } from '../../documents/entities/document.entity';
import { User } from '../../users/entities/user.entity';
import { RtrTemplate } from '../../rtr-template/entities/rtr-template.entity';
import { CompensationType, RTRStatus } from '../../common/enums';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
@Entity('rtrs')
export class RTR {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  candidateFirstName: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  candidateLastName: string;

  @Field(() => String)
  @Column()
  candidateEmail: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  candidatePhone: string;

  @Field(() => RTRStatus)
  @Column({ type: 'enum', enum: RTRStatus, default: RTRStatus.PENDING })
  status: RTRStatus;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  notes: string;

  @Field(() => Number, { nullable: true })
  @Column({ nullable: true })
  compensation: number;

  @Field(() => CompensationType, { nullable: true })
  @Column({ type: 'enum', enum: CompensationType, nullable: true })
  compensationType: CompensationType;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  expiresAt: Date;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  signedAt: Date;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  viewedAt: Date;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @Column({ default: false, nullable: true })
  resumeRequired: boolean;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @Column({ default: false, nullable: true })
  photoIdRequired: boolean;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @Column({ default: false, nullable: true })
  employerDetailsRequired: boolean;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @Column({ default: false, nullable: true })
  referencesRequired: boolean;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @Column({ default: false, nullable: true })
  skillsRequired: boolean;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @Field(() => CandidateProfile)
  @ManyToOne(() => CandidateProfile, (candidate) => candidate.rtrs)
  @JoinColumn({ name: 'candidateId' })
  candidate: CandidateProfile;

  @Field(() => RtrTemplate)
  @ManyToOne(() => RtrTemplate, (template) => template.rtrs)
  @JoinColumn({ name: 'rtrTemplateId' })
  rtrTemplate: RtrTemplate;

  @Field(() => RecruiterProfile)
  @ManyToOne(() => RecruiterProfile, (recruiter) => recruiter.rtrs)
  @JoinColumn({ name: 'recruiterId' })
  recruiter: RecruiterProfile;

  @Field(() => Organization, { nullable: true })
  @ManyToOne(() => Organization, (organization) => organization.rtrs, { nullable: true })
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @Field(() => Job, { nullable: true })
  @ManyToOne(() => Job, (job) => job.rtrs, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'jobId' })
  job: Job;

  @Field(() => [RTRHistory], { nullable: true })
  @OneToMany(() => RTRHistory, (history) => history.rtr)
  history: RTRHistory[];

  @Field(() => [Document], { nullable: true })
  @OneToMany(() => Document, (document) => document.rtr)
  documents: Document[];

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.rtrs)
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;
}
