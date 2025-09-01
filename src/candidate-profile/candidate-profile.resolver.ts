import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CandidateProfileService } from './candidate-profile.service';
import { CandidateProfile } from './entities/candidate-profile.entity';
import { CreateCandidateProfileInput } from './dto/create-candidate-profile.input';
import { UpdateCandidateProfileInput } from './dto/update-candidate-profile.input';

@Resolver(() => CandidateProfile)
export class CandidateProfileResolver {
  constructor(private readonly candidateProfileService: CandidateProfileService) {}

  @Mutation(() => CandidateProfile)
  createCandidateProfile(@Args('createCandidateProfileInput') createCandidateProfileInput: CreateCandidateProfileInput) {
    return this.candidateProfileService.create(createCandidateProfileInput);
  }

  @Query(() => [CandidateProfile], { name: 'candidateProfile' })
  findAll() {
    return this.candidateProfileService.findAll();
  }

  @Query(() => CandidateProfile, { name: 'candidateProfile' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.candidateProfileService.findOne(id);
  }

  @Mutation(() => CandidateProfile)
  updateCandidateProfile(@Args('updateCandidateProfileInput') updateCandidateProfileInput: UpdateCandidateProfileInput) {
    return this.candidateProfileService.update(updateCandidateProfileInput.id, updateCandidateProfileInput);
  }

  @Mutation(() => CandidateProfile)
  removeCandidateProfile(@Args('id', { type: () => Int }) id: number) {
    return this.candidateProfileService.remove(id);
  }
}
