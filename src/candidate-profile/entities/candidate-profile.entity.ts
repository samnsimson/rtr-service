import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { JobApplication } from '../../job-applications/entities/job-application.entity';
import { RTR } from '../../rtr/entities/rtr.entity';
import { RemotePreference } from '../../common/enums';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('candidate_profiles')
export class CandidateProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  experience: number; // Years of experience

  @Column('simple-array', { nullable: true })
  skills: string[]; // Array of skills

  @Column({ nullable: true })
  resumeUrl: string;

  @Column({ nullable: true })
  linkedinUrl: string;

  @Column({ nullable: true })
  portfolioUrl: string;

  @Column({ nullable: true })
  location: string;

  @Column({ default: false })
  willingToRelocate: boolean;

  @Column({
    type: 'enum',
    enum: RemotePreference,
    default: RemotePreference.ANY,
  })
  remotePreference: RemotePreference;

  @Column({ nullable: true })
  expectedSalary: number; // Annual salary expectation

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToOne(() => User, (user) => user.candidateProfile)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => JobApplication, (application) => application.candidate)
  applications: JobApplication[];

  @OneToMany(() => RTR, (rtr) => rtr.candidate)
  rtrs: RTR[];
}
