import { Module } from '@nestjs/common';
import { CandidateProfileService } from './candidate-profile.service';
import { CandidateProfileResolver } from './candidate-profile.resolver';

@Module({
  providers: [CandidateProfileResolver, CandidateProfileService],
})
export class CandidateProfileModule {}
