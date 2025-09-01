import { Module } from '@nestjs/common';
import { RecruiterProfileService } from './recruiter-profile.service';
import { RecruiterProfileResolver } from './recruiter-profile.resolver';

@Module({
  providers: [RecruiterProfileResolver, RecruiterProfileService],
})
export class RecruiterProfileModule {}
