import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecruiterProfileService } from './recruiter-profile.service';
import { RecruiterProfileResolver } from './recruiter-profile.resolver';
import { RecruiterProfile } from './entities/recruiter-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecruiterProfile])],
  providers: [RecruiterProfileResolver, RecruiterProfileService],
  exports: [RecruiterProfileService],
})
export class RecruiterProfileModule {}
