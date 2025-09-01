import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CandidateProfileService } from './candidate-profile.service';
import { CandidateProfile } from './entities/candidate-profile.entity';
import { CreateCandidateProfileInput, UpdateCandidateProfileInput } from './dto';

@Resolver(() => CandidateProfile)
export class CandidateProfileResolver {
  constructor(private readonly candidateProfileService: CandidateProfileService) {}

  @Mutation(() => CandidateProfile)
  createCandidateProfile(@Args('createCandidateProfileInput') createCandidateProfileInput: CreateCandidateProfileInput) {
    return this.candidateProfileService.create(createCandidateProfileInput);
  }

  @Query(() => [CandidateProfile], { name: 'candidateProfiles' })
  findAll() {
    return this.candidateProfileService.findAll();
  }

  @Query(() => CandidateProfile, { name: 'candidateProfile' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.candidateProfileService.findOne(id);
  }

  @Mutation(() => CandidateProfile)
  updateCandidateProfile(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateCandidateProfileInput') updateCandidateProfileInput: UpdateCandidateProfileInput,
  ) {
    return this.candidateProfileService.update(id, updateCandidateProfileInput);
  }

  @Mutation(() => CandidateProfile)
  removeCandidateProfile(@Args('id', { type: () => Int }) id: number) {
    return this.candidateProfileService.remove(id);
  }
}
