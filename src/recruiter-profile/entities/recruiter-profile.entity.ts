import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Job } from '../../jobs/entities/job.entity';
import { RTR } from '../../rtr/entities/rtr.entity';
import { CompanySize } from '../../common/enums';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('recruiter_profiles')
export class RecruiterProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

  @Column()
  companyName: string;

  @Column({ nullable: true })
  companyWebsite: string;

  @Column({ nullable: true })
  industry: string;

  @Column({
    type: 'enum',
    enum: CompanySize,
    nullable: true,
  })
  companySize: CompanySize;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  linkedinUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToOne(() => User, (user) => user.recruiterProfile)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Job, (job) => job.recruiter)
  jobs: Job[];

  @OneToMany(() => RTR, (rtr) => rtr.recruiter)
  rtrs: RTR[];
}
