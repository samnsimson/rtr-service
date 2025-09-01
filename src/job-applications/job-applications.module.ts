import { Module } from '@nestjs/common';
import { JobApplicationsService } from './job-applications.service';
import { JobApplicationsResolver } from './job-applications.resolver';

@Module({
  providers: [JobApplicationsResolver, JobApplicationsService],
})
export class JobApplicationsModule {}
