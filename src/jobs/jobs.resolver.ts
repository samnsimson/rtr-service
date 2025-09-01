import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { JobsService } from './jobs.service';
import { Job } from './entities/job.entity';
import { CreateJobInput, UpdateJobInput } from './dto';

@Resolver(() => Job)
export class JobsResolver {
  constructor(private readonly jobsService: JobsService) {}

  @Mutation(() => Job)
  createJob(@Args('createJobInput') createJobInput: CreateJobInput) {
    return this.jobsService.create(createJobInput);
  }

  @Query(() => [Job], { name: 'jobs' })
  findAll() {
    return this.jobsService.findAll();
  }

  @Query(() => Job, { name: 'job' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.jobsService.findOne(id);
  }

  @Mutation(() => Job)
  updateJob(@Args('id', { type: () => Int }) id: number, @Args('updateJobInput') updateJobInput: UpdateJobInput) {
    return this.jobsService.update(id, updateJobInput);
  }

  @Mutation(() => Job)
  removeJob(@Args('id', { type: () => Int }) id: number) {
    return this.jobsService.remove(id);
  }
}
