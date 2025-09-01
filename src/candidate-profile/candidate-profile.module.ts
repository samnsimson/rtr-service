import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateProfileService } from './candidate-profile.service';
import { CandidateProfileResolver } from './candidate-profile.resolver';
import { CandidateProfile } from './entities/candidate-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CandidateProfile])],
  providers: [CandidateProfileResolver, CandidateProfileService],
  exports: [CandidateProfileService],
})
export class CandidateProfileModule {}
