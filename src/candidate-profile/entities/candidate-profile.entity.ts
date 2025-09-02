import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Organization } from '../../organizations/entities/organization.entity';
import { JobApplication } from '../../job-applications/entities/job-application.entity';
import { RTR } from '../../rtr/entities/rtr.entity';
import { RemotePreference } from '../../common/enums';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
@Entity('candidate_profiles')
export class CandidateProfile {
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

  @Field(() => Number, { nullable: true })
  @Column({ nullable: true })
  experience: number; // Years of experience

  @Field(() => [String], { nullable: true })
  @Column('simple-array', { nullable: true })
  skills: string[]; // Array of skills

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  education: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  experienceLevel: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  resumeUrl: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  linkedinUrl: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  portfolioUrl: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  location: string;

  @Field(() => Boolean)
  @Column({ default: false })
  willingToRelocate: boolean;

  @Field(() => RemotePreference)
  @Column({
    type: 'enum',
    enum: RemotePreference,
    default: RemotePreference.ANY,
  })
  remotePreference: RemotePreference;

  @Field(() => Number, { nullable: true })
  @Column({ nullable: true })
  expectedSalary: number; // Annual salary expectation

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  organizationId: string;

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
  @OneToOne(() => User, (user) => user.candidateProfile)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Field(() => Organization, { nullable: true })
  @ManyToOne(() => Organization, (organization) => organization.users, { nullable: true })
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @Field(() => [JobApplication], { nullable: true })
  @OneToMany(() => JobApplication, (application) => application.candidate)
  applications: JobApplication[];

  @Field(() => [RTR], { nullable: true })
  @OneToMany(() => RTR, (rtr) => rtr.candidate)
  rtrs: RTR[];
}
