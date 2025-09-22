import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobApplicationsService } from './job-applications.service';
import { JobApplicationsResolver } from './job-applications.resolver';
import { JobApplication } from './entities/job-application.entity';
import { Job } from '../jobs/entities/job.entity';
import { CandidateProfile } from '../candidate-profile/entities/candidate-profile.entity';
import { RecruiterProfile } from '../recruiter-profile/entities/recruiter-profile.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([JobApplication, Job, CandidateProfile, RecruiterProfile, Organization]), forwardRef(() => EmailModule)],
  providers: [JobApplicationsResolver, JobApplicationsService],
  exports: [JobApplicationsService],
})
export class JobApplicationsModule {}
