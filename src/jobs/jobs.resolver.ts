import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { JobsService } from './jobs.service';
import { CreateJobInput, JobResponse, UpdateJobInput } from './dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/common/enums';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Resolver(() => JobResponse)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.RECRUITER, UserRole.ADMIN)
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
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.jobsService.findOne(id);
  }

  @Mutation(() => JobResponse)
  updateJob(@Args('id', { type: () => String }) id: string, @Args('updateJobInput') updateJobInput: UpdateJobInput) {
    return this.jobsService.update(id, updateJobInput);
  }

  @Mutation(() => JobResponse)
  removeJob(@Args('id', { type: () => String }) id: string) {
    return this.jobsService.remove(id);
  }
}
