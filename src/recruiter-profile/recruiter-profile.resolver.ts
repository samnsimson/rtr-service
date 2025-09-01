import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RecruiterProfileService } from './recruiter-profile.service';
import { RecruiterProfile } from './entities/recruiter-profile.entity';
import { CreateRecruiterProfileInput, UpdateRecruiterProfileInput } from './dto';

@Resolver(() => RecruiterProfile)
export class RecruiterProfileResolver {
  constructor(private readonly recruiterProfileService: RecruiterProfileService) {}

  @Mutation(() => RecruiterProfile)
  async createRecruiterProfile(@Args('createRecruiterProfileInput') createRecruiterProfileInput: CreateRecruiterProfileInput): Promise<RecruiterProfile> {
    const profile = this.recruiterProfileService.create(createRecruiterProfileInput);
    return profile;
  }

  @Query(() => [RecruiterProfile], { name: 'recruiterProfiles' })
  async findAll(): Promise<RecruiterProfile[]> {
    const profiles = this.recruiterProfileService.findAll();
    return profiles;
  }

  @Query(() => RecruiterProfile, { name: 'recruiterProfile' })
  async findOne(@Args('id', { type: () => Int }) id: number): Promise<RecruiterProfile> {
    const profile = this.recruiterProfileService.findOne(id);
    return profile;
  }

  @Mutation(() => RecruiterProfile)
  async updateRecruiterProfile(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateRecruiterProfileInput') updateRecruiterProfileInput: UpdateRecruiterProfileInput,
  ): Promise<RecruiterProfile> {
    const profile = this.recruiterProfileService.update(id, updateRecruiterProfileInput);
    return profile;
  }

  @Mutation(() => Boolean)
  async removeRecruiterProfile(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.recruiterProfileService.remove(id);
    return true;
  }
}
