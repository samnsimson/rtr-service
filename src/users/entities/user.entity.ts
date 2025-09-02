import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { RecruiterProfile } from '../../recruiter-profile/entities/recruiter-profile.entity';
import { CandidateProfile } from '../../candidate-profile/entities/candidate-profile.entity';
import { RTR } from '../../rtr/entities/rtr.entity';
import { RTRHistory } from '../../rtr-history/entities/rtr-history.entity';
import { Notification } from '../../notifications/entities/notification.entity';
import { Organization } from '../../organizations/entities/organization.entity';
import { UserRole } from '../../common/enums';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
@Entity('users')
export class User {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column({ unique: true })
  email: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  password: string;

  @Field(() => UserRole)
  @Column({ type: 'enum', enum: UserRole, default: UserRole.CANDIDATE })
  role: UserRole;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  avatar: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  phone: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  organizationId: string;

  @Field(() => Boolean)
  @Column({ default: true })
  isActive: boolean;

  @Field(() => Boolean)
  @Column({ default: false })
  isEmailVerified: boolean;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @Field(() => Organization, { nullable: true })
  @ManyToOne(() => Organization, (organization) => organization.users, { nullable: true })
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @Field(() => RecruiterProfile, { nullable: true })
  @OneToOne(() => RecruiterProfile, (profile) => profile.user)
  recruiterProfile: RecruiterProfile;

  @Field(() => CandidateProfile, { nullable: true })
  @OneToOne(() => CandidateProfile, (profile) => profile.user)
  candidateProfile: CandidateProfile;

  @Field(() => [RTR], { nullable: true })
  @OneToMany(() => RTR, (rtr) => rtr.user)
  rtrs: RTR[];

  @Field(() => [RTRHistory], { nullable: true })
  @OneToMany(() => RTRHistory, (history) => history.user)
  rtrHistory: RTRHistory[];

  @Field(() => [Notification], { nullable: true })
  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @Field(() => [User], { nullable: true })
  @OneToMany(() => User, (user) => user.createdBy)
  createdUsers: User[];

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.createdUsers, { nullable: true })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  createdById: string;
}
