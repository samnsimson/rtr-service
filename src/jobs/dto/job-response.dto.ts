import { ObjectType, Field, Int } from '@nestjs/graphql';
import { WorkType, JobType, CompensationType, JobStatus } from '../../common/enums';
import { PaginatedResponse } from 'src/common/dto/paginated-response.dto';

@ObjectType()
export class JobResponse {
  @Field()
  id: string;

  @Field({ nullable: true })
  jobId?: string;

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

  @Field({ nullable: true })
  organizationId?: string;

  @Field(() => JobStatus)
  status: JobStatus;

  @Field(() => Boolean)
  starred: boolean;

  @Field({ nullable: true })
  expiresAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  constructor(partial?: Partial<JobResponse>) {
    Object.assign(this, partial);
  }
}

@ObjectType()
export class JobResponsePaginated implements PaginatedResponse<JobResponse> {
  @Field(() => [JobResponse])
  data: JobResponse[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  totalPages: number;

  constructor(partial?: Partial<JobResponsePaginated>) {
    Object.assign(this, partial);
    this.page = partial?.page || 1;
    this.limit = partial?.limit || 10;
    this.totalPages = Math.ceil(this.total / this.limit);
  }
}
