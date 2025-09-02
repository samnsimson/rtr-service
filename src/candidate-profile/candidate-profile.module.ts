import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateProfileService } from './candidate-profile.service';
import { CandidateProfileResolver } from './candidate-profile.resolver';
import { CandidateProfile } from './entities/candidate-profile.entity';
import { Organization } from '../organizations/entities/organization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CandidateProfile, Organization])],
  providers: [CandidateProfileResolver, CandidateProfileService],
  exports: [CandidateProfileService],
})
export class CandidateProfileModule {}
