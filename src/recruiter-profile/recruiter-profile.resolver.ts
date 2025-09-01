import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RecruiterProfileService } from './recruiter-profile.service';
import { CreateRecruiterProfileInput, RecruiterProfileResponse, UpdateRecruiterProfileInput } from './dto';

@Resolver(() => RecruiterProfileResponse)
export class RecruiterProfileResolver {
  constructor(private readonly recruiterProfileService: RecruiterProfileService) {}

  @Mutation(() => RecruiterProfileResponse)
  async createRecruiterProfile(
    @Args('createRecruiterProfileInput') createRecruiterProfileInput: CreateRecruiterProfileInput,
  ): Promise<RecruiterProfileResponse> {
    const profile = this.recruiterProfileService.create(createRecruiterProfileInput);
    return profile;
  }

  @Query(() => [RecruiterProfileResponse], { name: 'recruiterProfiles' })
  async findAll(): Promise<RecruiterProfileResponse[]> {
    const profiles = this.recruiterProfileService.findAll();
    return profiles;
  }

  @Query(() => RecruiterProfileResponse, { name: 'recruiterProfile' })
  async findOne(@Args('id', { type: () => Int }) id: number): Promise<RecruiterProfileResponse> {
    const profile = this.recruiterProfileService.findOne(id);
    return profile;
  }

  @Mutation(() => RecruiterProfileResponse)
  async updateRecruiterProfile(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateRecruiterProfileInput') updateRecruiterProfileInput: UpdateRecruiterProfileInput,
  ): Promise<RecruiterProfileResponse> {
    const profile = this.recruiterProfileService.update(id, updateRecruiterProfileInput);
    return profile;
  }

  @Mutation(() => Boolean)
  async removeRecruiterProfile(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.recruiterProfileService.remove(id);
    return true;
  }
}
