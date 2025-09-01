import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { JobApplicationsService } from './job-applications.service';
import { JobApplication } from './entities/job-application.entity';
import { CreateJobApplicationInput } from './dto/create-job-application.input';
import { UpdateJobApplicationInput } from './dto/update-job-application.input';

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
  updateJobApplication(@Args('updateJobApplicationInput') updateJobApplicationInput: UpdateJobApplicationInput) {
    return this.jobApplicationsService.update(updateJobApplicationInput.id, updateJobApplicationInput);
  }

  @Mutation(() => JobApplication)
  removeJobApplication(@Args('id', { type: () => Int }) id: number) {
    return this.jobApplicationsService.remove(id);
  }
}
