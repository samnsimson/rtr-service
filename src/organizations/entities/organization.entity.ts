import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { Job } from '../../jobs/entities/job.entity';
import { RTR } from '../../rtr/entities/rtr.entity';
import { CandidateProfile } from '../../candidate-profile/entities/candidate-profile.entity';
import { RecruiterProfile } from '../../recruiter-profile/entities/recruiter-profile.entity';
import { JobApplication } from '../../job-applications/entities/job-application.entity';
import { RTRHistory } from '../../rtr-history/entities/rtr-history.entity';
import { Document } from '../../documents/entities/document.entity';
import { Notification } from '../../notifications/entities/notification.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { RtrTemplate } from '../../rtr-template/entities/rtr-template.entity';
import { CompanySize } from '../../common/enums';

@ObjectType()
@Entity('organizations')
export class Organization {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column({ unique: true })
  name: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  website: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  industry: string;

  @Field(() => CompanySize, { nullable: true })
  @Column({
    type: 'enum',
    enum: CompanySize,
    nullable: true,
  })
  companySize: CompanySize;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  location: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  description: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  linkedinUrl: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  logo: string;

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
  @Field(() => [User], { nullable: true })
  @OneToMany(() => User, (user) => user.organization)
  users: User[];

  @Field(() => [Job], { nullable: true })
  @OneToMany(() => Job, (job) => job.organization)
  jobs: Job[];

  @Field(() => [RTR], { nullable: true })
  @OneToMany(() => RTR, (rtr) => rtr.organization)
  rtrs: RTR[];

  @Field(() => [CandidateProfile], { nullable: true })
  @OneToMany(() => CandidateProfile, (profile) => profile.organization)
  candidateProfiles: CandidateProfile[];

  @Field(() => [RecruiterProfile], { nullable: true })
  @OneToMany(() => RecruiterProfile, (profile) => profile.user?.organization)
  recruiterProfiles: RecruiterProfile[];

  @Field(() => [JobApplication], { nullable: true })
  @OneToMany(() => JobApplication, (application) => application.organization)
  jobApplications: JobApplication[];

  @Field(() => [RTRHistory], { nullable: true })
  @OneToMany(() => RTRHistory, (history) => history.organization)
  rtrHistory: RTRHistory[];

  @Field(() => [Document], { nullable: true })
  @OneToMany(() => Document, (document) => document.organization)
  documents: Document[];

  @Field(() => [Notification], { nullable: true })
  @OneToMany(() => Notification, (notification) => notification.organization)
  notifications: Notification[];

  @Field(() => [Subscription], { nullable: true })
  @OneToMany(() => Subscription, (subscription) => subscription.organization)
  subscriptions: Subscription[];

  @Field(() => [Payment], { nullable: true })
  @OneToMany(() => Payment, (payment) => payment.organization)
  payments: Payment[];

  @Field(() => [RtrTemplate], { nullable: true })
  @OneToMany(() => RtrTemplate, (template) => template.organization)
  rtrTemplates: RtrTemplate[];
}
