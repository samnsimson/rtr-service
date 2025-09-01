import { ObjectType, Field, Int } from '@nestjs/graphql';
import { WorkType, JobType, CompensationType, JobStatus } from '../../common/enums';

@ObjectType()
export class JobResponse {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  company: string;

  @Field()
  description: string;

  @Field(() => [String])
  requirements: string[];

  @Field()
  location: string;

  @Field(() => WorkType)
  workType: WorkType;

  @Field(() => JobType)
  jobType: JobType;

  @Field(() => CompensationType)
  compensation: CompensationType;

  @Field(() => Int, { nullable: true })
  salaryMin?: number;

  @Field(() => Int, { nullable: true })
  salaryMax?: number;

  @Field(() => [String])
  benefits: string[];

  @Field()
  recruiterId: string;

  @Field(() => JobStatus)
  status: JobStatus;

  @Field({ nullable: true })
  expiresAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
