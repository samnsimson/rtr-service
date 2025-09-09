import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { RecruiterProfileService } from './recruiter-profile.service';
import { CreateRecruiterProfileInput, RecruiterProfileResponse, UpdateRecruiterProfileInput } from './dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from 'src/common/enums';
import { Roles } from 'src/common/decorators/roles.decorator';

@Resolver(() => RecruiterProfileResponse)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.RECRUITER, UserRole.ADMIN)
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
  async findOne(@Args('id', { type: () => String }) id: string): Promise<RecruiterProfileResponse> {
    const profile = this.recruiterProfileService.findOne(id);
    return profile;
  }

  @Mutation(() => RecruiterProfileResponse)
  async updateRecruiterProfile(
    @Args('id', { type: () => String }) id: string,
    @Args('updateRecruiterProfileInput') updateRecruiterProfileInput: UpdateRecruiterProfileInput,
  ): Promise<RecruiterProfileResponse> {
    const profile = this.recruiterProfileService.update(id, updateRecruiterProfileInput);
    return profile;
  }

  @Mutation(() => Boolean)
  async removeRecruiterProfile(@Args('id', { type: () => String }) id: string): Promise<boolean> {
    await this.recruiterProfileService.remove(id);
    return true;
  }
}
