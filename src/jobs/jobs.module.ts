import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsService } from './jobs.service';
import { JobsResolver } from './jobs.resolver';
import { Job } from './entities/job.entity';
import { RecruiterProfile } from '../recruiter-profile/entities/recruiter-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job, RecruiterProfile])],
  providers: [JobsResolver, JobsService],
})
export class JobsModule {}
