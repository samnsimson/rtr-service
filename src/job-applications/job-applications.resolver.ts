import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { JobApplicationsService } from './job-applications.service';
import { JobApplication } from './entities/job-application.entity';
import { CreateJobApplicationInput, UpdateJobApplicationInput } from './dto';

@Resolver(() => JobApplication)
export class JobApplicationsResolver {
  constructor(private readonly jobApplicationsService: JobApplicationsService) {}

  @Mutation(() => JobApplication)
  createJobApplication(@Args('createJobApplicationInput') createJobApplicationInput: CreateJobApplicationInput) {
    return this.jobApplicationsService.create(createJobApplicationInput);
  }

  @Query(() => [JobApplication], { name: 'jobApplications' })
  findAll() {
    return this.jobApplicationsService.findAll();
  }

  @Query(() => JobApplication, { name: 'jobApplication' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.jobApplicationsService.findOne(id);
  }

  @Mutation(() => JobApplication)
  updateJobApplication(@Args('id', { type: () => Int }) id: number, @Args('updateJobApplicationInput') updateJobApplicationInput: UpdateJobApplicationInput) {
    return this.jobApplicationsService.update(id, updateJobApplicationInput);
  }

  @Mutation(() => JobApplication)
  removeJobApplication(@Args('id', { type: () => Int }) id: number) {
    return this.jobApplicationsService.remove(id);
  }
}
