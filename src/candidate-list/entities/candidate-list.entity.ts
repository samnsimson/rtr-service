import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ExperiencePeriod } from 'src/common';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('candidate_list')
export class CandidateList {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  firstName: string;

  @Field(() => String)
  @Column()
  lastName: string;

  @Field(() => String)
  @Column()
  email: string;

  @Field(() => String)
  @Column()
  phone: string;

  @Field(() => String, { nullable: true, defaultValue: null })
  @Column({ nullable: true, default: null })
  resumeUrl: string;

  @Field(() => String, { nullable: true, defaultValue: null })
  @Column({ nullable: true, default: null })
  photoIdUrl: string;

  @Field(() => String, { nullable: true, defaultValue: null })
  @Column({ nullable: true, default: null })
  linkedinUrl: string;

  @Field(() => String, { nullable: true, defaultValue: null })
  @Column({ nullable: true, default: null })
  portfolioUrl: string;

  @Field(() => Int, { nullable: true, defaultValue: null })
  @Column({ nullable: true, default: null })
  experience: string;

  @Field(() => ExperiencePeriod, { defaultValue: ExperiencePeriod.YEARS })
  @Column({ default: ExperiencePeriod.YEARS })
  experiencePeriod: ExperiencePeriod;
}
