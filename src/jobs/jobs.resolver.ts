import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { JobsService } from './jobs.service';
import { CreateJobInput, JobResponse, UpdateJobInput } from './dto';

@Resolver(() => JobResponse)
export class JobsResolver {
  constructor(private readonly jobsService: JobsService) {}

  @Mutation(() => JobResponse)
  createJob(@Args('createJobInput') createJobInput: CreateJobInput) {
    return this.jobsService.create(createJobInput);
  }

  @Query(() => [JobResponse], { name: 'jobs' })
  findAll() {
    return this.jobsService.findAll();
  }

  @Query(() => JobResponse, { name: 'job' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.jobsService.findOne(id);
  }

  @Mutation(() => JobResponse)
  updateJob(@Args('id', { type: () => Int }) id: number, @Args('updateJobInput') updateJobInput: UpdateJobInput) {
    return this.jobsService.update(id, updateJobInput);
  }

  @Mutation(() => JobResponse)
  removeJob(@Args('id', { type: () => Int }) id: number) {
    return this.jobsService.remove(id);
  }
}
