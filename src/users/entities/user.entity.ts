import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany } from 'typeorm';
import { RecruiterProfile } from '../../recruiter-profile/entities/recruiter-profile.entity';
import { CandidateProfile } from '../../candidate-profile/entities/candidate-profile.entity';
import { RTR } from '../../rtr/entities/rtr.entity';
import { RTRHistory } from '../../rtr-history/entities/rtr-history.entity';
import { Notification } from '../../notifications/entities/notification.entity';
import { UserRole } from '../../common/enums';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CANDIDATE })
  role: UserRole;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  phone: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToOne(() => RecruiterProfile, (profile) => profile.user)
  recruiterProfile: RecruiterProfile;

  @OneToOne(() => CandidateProfile, (profile) => profile.user)
  candidateProfile: CandidateProfile;

  @OneToMany(() => RTR, (rtr) => rtr.user)
  rtrs: RTR[];

  @OneToMany(() => RTRHistory, (history) => history.user)
  rtrHistory: RTRHistory[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
