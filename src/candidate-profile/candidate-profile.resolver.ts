import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CandidateProfileService } from './candidate-profile.service';
import { CandidateProfileResponse, CreateCandidateProfileInput, UpdateCandidateProfileInput } from './dto';

@Resolver(() => CandidateProfileResponse)
export class CandidateProfileResolver {
  constructor(private readonly candidateProfileService: CandidateProfileService) {}

  @Mutation(() => CandidateProfileResponse)
  createCandidateProfile(@Args('createCandidateProfileInput') createCandidateProfileInput: CreateCandidateProfileInput) {
    return this.candidateProfileService.create(createCandidateProfileInput);
  }

  @Query(() => [CandidateProfileResponse], { name: 'candidateProfiles' })
  findAll() {
    return this.candidateProfileService.findAll();
  }

  @Query(() => CandidateProfileResponse, { name: 'candidateProfile' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.candidateProfileService.findOne(id);
  }

  @Mutation(() => CandidateProfileResponse)
  updateCandidateProfile(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateCandidateProfileInput') updateCandidateProfileInput: UpdateCandidateProfileInput,
  ) {
    return this.candidateProfileService.update(id, updateCandidateProfileInput);
  }

  @Mutation(() => CandidateProfileResponse)
  removeCandidateProfile(@Args('id', { type: () => Int }) id: number) {
    return this.candidateProfileService.remove(id);
  }
}
