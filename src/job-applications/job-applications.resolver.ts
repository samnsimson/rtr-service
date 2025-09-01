import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { JobApplicationsService } from './job-applications.service';
import { CreateJobApplicationInput, JobApplicationResponse, UpdateJobApplicationInput } from './dto';

@Resolver(() => JobApplicationResponse)
export class JobApplicationsResolver {
  constructor(private readonly jobApplicationsService: JobApplicationsService) {}

  @Mutation(() => JobApplicationResponse)
  createJobApplication(@Args('createJobApplicationInput') createJobApplicationInput: CreateJobApplicationInput) {
    return this.jobApplicationsService.create(createJobApplicationInput);
  }

  @Query(() => [JobApplicationResponse], { name: 'jobApplications' })
  findAll() {
    return this.jobApplicationsService.findAll();
  }

  @Query(() => JobApplicationResponse, { name: 'jobApplication' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.jobApplicationsService.findOne(id);
  }

  @Mutation(() => JobApplicationResponse)
  updateJobApplication(@Args('id', { type: () => Int }) id: number, @Args('updateJobApplicationInput') updateJobApplicationInput: UpdateJobApplicationInput) {
    return this.jobApplicationsService.update(id, updateJobApplicationInput);
  }

  @Mutation(() => JobApplicationResponse)
  removeJobApplication(@Args('id', { type: () => Int }) id: number) {
    return this.jobApplicationsService.remove(id);
  }
}
