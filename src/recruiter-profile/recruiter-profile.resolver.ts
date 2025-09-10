import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { RecruiterProfileService } from './recruiter-profile.service';
import { CreateRecruiterProfileInput, RecruiterProfileResponse, UpdateRecruiterProfileInput } from './dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
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
    const profile = await this.recruiterProfileService.create(createRecruiterProfileInput);
    return new RecruiterProfileResponse(profile);
  }

  @Query(() => [RecruiterProfileResponse], { name: 'recruiterProfiles' })
  async findAll(): Promise<RecruiterProfileResponse[]> {
    const profiles = await this.recruiterProfileService.findAll();
    return profiles.map((profile) => new RecruiterProfileResponse(profile));
  }

  @Query(() => RecruiterProfileResponse, { name: 'recruiterProfile' })
  async findOne(@Args('id', { type: () => String }) id: string): Promise<RecruiterProfileResponse> {
    const profile = await this.recruiterProfileService.findOne(id);
    return new RecruiterProfileResponse(profile);
  }

  @Mutation(() => RecruiterProfileResponse)
  async updateRecruiterProfile(
    @Args('id', { type: () => String }) id: string,
    @Args('updateRecruiterProfileInput') updateRecruiterProfileInput: UpdateRecruiterProfileInput,
  ): Promise<RecruiterProfileResponse> {
    const profile = await this.recruiterProfileService.update(id, updateRecruiterProfileInput);
    return new RecruiterProfileResponse(profile);
  }

  @Mutation(() => Boolean)
  async removeRecruiterProfile(@Args('id', { type: () => String }) id: string): Promise<boolean> {
    await this.recruiterProfileService.remove(id);
    return true;
  }
}
