import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RecruiterProfileService } from './recruiter-profile.service';
import { RecruiterProfile } from './entities/recruiter-profile.entity';
import { CreateRecruiterProfileInput, UpdateRecruiterProfileInput } from './dto';

@Resolver(() => RecruiterProfile)
export class RecruiterProfileResolver {
  constructor(private readonly recruiterProfileService: RecruiterProfileService) {}

  @Mutation(() => RecruiterProfile)
  createRecruiterProfile(@Args('createRecruiterProfileInput') createRecruiterProfileInput: CreateRecruiterProfileInput) {
    return this.recruiterProfileService.create(createRecruiterProfileInput);
  }

  @Query(() => [RecruiterProfile], { name: 'recruiterProfiles' })
  findAll() {
    return this.recruiterProfileService.findAll();
  }

  @Query(() => RecruiterProfile, { name: 'recruiterProfile' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.recruiterProfileService.findOne(id);
  }

  @Mutation(() => RecruiterProfile)
  updateRecruiterProfile(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateRecruiterProfileInput') updateRecruiterProfileInput: UpdateRecruiterProfileInput,
  ) {
    return this.recruiterProfileService.update(id, updateRecruiterProfileInput);
  }

  @Mutation(() => RecruiterProfile)
  removeRecruiterProfile(@Args('id', { type: () => Int }) id: number) {
    return this.recruiterProfileService.remove(id);
  }
}
