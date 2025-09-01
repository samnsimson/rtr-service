import { ObjectType, Field, Int } from '@nestjs/graphql';
import { RemotePreference } from '../../common/enums';

@ObjectType()
export class CandidateProfileResponse {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field({ nullable: true })
  title?: string;

  @Field(() => Int, { nullable: true })
  experience?: number;

  @Field(() => [String], { nullable: true })
  skills?: string[];

  @Field({ nullable: true })
  resumeUrl?: string;

  @Field({ nullable: true })
  linkedinUrl?: string;

  @Field({ nullable: true })
  portfolioUrl?: string;

  @Field({ nullable: true })
  location?: string;

  @Field()
  willingToRelocate: boolean;

  @Field(() => RemotePreference)
  remotePreference: RemotePreference;

  @Field(() => Int, { nullable: true })
  expectedSalary?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
