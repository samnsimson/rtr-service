import { ObjectType, Field } from '@nestjs/graphql';
import { ApplicationStatus } from '../../common/enums';

@ObjectType()
export class JobApplicationResponse {
  @Field()
  id: string;

  @Field()
  jobId: string;

  @Field()
  candidateId: string;

  @Field({ nullable: true })
  organizationId?: string;

  @Field(() => ApplicationStatus)
  status: ApplicationStatus;

  @Field({ nullable: true })
  coverLetter?: string;

  @Field({ nullable: true })
  notes?: string;

  @Field()
  appliedAt: Date;

  @Field()
  updatedAt: Date;
}
