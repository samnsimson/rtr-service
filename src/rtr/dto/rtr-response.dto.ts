import { ObjectType, Field } from '@nestjs/graphql';
import { RTRStatus } from '../../common/enums';
import { CandidateProfileResponse } from 'src/candidate-profile/dto';
import { RecruiterProfile } from 'src/recruiter-profile/entities/recruiter-profile.entity';
import { JobResponse } from 'src/jobs/dto';
import { Organization } from 'src/organizations/entities/organization.entity';
import { RtrTemplate } from 'src/rtr-template/entities/rtr-template.entity';

@ObjectType()
export class RtrResponse {
  @Field()
  id: string;

  @Field(() => RTRStatus)
  status: RTRStatus;

  @Field({ nullable: true })
  notes?: string;

  @Field({ nullable: true })
  expiresAt?: Date;

  @Field({ nullable: true })
  signedAt?: Date;

  @Field({ nullable: true })
  viewedAt?: Date;

  @Field()
  resumeRequired: boolean;

  @Field(() => Boolean)
  photoIdRequired: boolean;

  @Field(() => Boolean)
  employerDetailsRequired: boolean;

  @Field(() => Boolean)
  referencesRequired: boolean;

  @Field(() => Boolean)
  skillsRequired: boolean;

  @Field(() => CandidateProfileResponse, { nullable: true })
  candidate?: CandidateProfileResponse;

  @Field(() => RecruiterProfile)
  recruiter: RecruiterProfile;

  @Field(() => JobResponse)
  job: JobResponse;

  @Field(() => Organization)
  organization: Organization;

  @Field(() => RtrTemplate)
  rtrTemplate: RtrTemplate;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  constructor(partial?: Partial<RtrResponse>) {
    Object.assign(this, partial);
  }
}
