import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CandidateProfileService } from './candidate-profile.service';
import { CandidateProfileResponse, CreateCandidateProfileInput, UpdateCandidateProfileInput } from './dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/common/enums';
import { AuthUser, CurrentUser } from 'src/common';

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
  findOne(@Args('id', { type: () => String }) id: string, @AuthUser() user: CurrentUser) {
    return this.candidateProfileService.findOne(id, user);
  }

  @Mutation(() => CandidateProfileResponse)
  updateCandidateProfile(
    @Args('id', { type: () => String }) id: string,
    @Args('updateCandidateProfileInput') updateCandidateProfileInput: UpdateCandidateProfileInput,
    @AuthUser() user: CurrentUser,
  ) {
    return this.candidateProfileService.update(id, user, updateCandidateProfileInput);
  }

  @Mutation(() => Boolean)
  async removeCandidateProfile(@Args('id', { type: () => String }) id: string, @AuthUser() user: CurrentUser) {
    await this.candidateProfileService.remove(id, user);
    return true;
  }
}
