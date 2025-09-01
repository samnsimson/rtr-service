import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CandidateProfileService } from './candidate-profile.service';
import { CandidateProfileResponse, CreateCandidateProfileInput, UpdateCandidateProfileInput } from './dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/common/enums';

@Resolver(() => CandidateProfileResponse)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.CANDIDATE, UserRole.ADMIN)
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
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.candidateProfileService.findOne(id);
  }

  @Mutation(() => CandidateProfileResponse)
  updateCandidateProfile(
    @Args('id', { type: () => String }) id: string,
    @Args('updateCandidateProfileInput') updateCandidateProfileInput: UpdateCandidateProfileInput,
  ) {
    return this.candidateProfileService.update(id, updateCandidateProfileInput);
  }

  @Mutation(() => Boolean)
  async removeCandidateProfile(@Args('id', { type: () => String }) id: string) {
    await this.candidateProfileService.remove(id);
    return true;
  }
}
