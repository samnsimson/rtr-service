import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobApplicationsService } from './job-applications.service';
import { JobApplicationsResolver } from './job-applications.resolver';
import { JobApplication } from './entities/job-application.entity';
import { Organization } from '../organizations/entities/organization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobApplication, Organization])],
  providers: [JobApplicationsResolver, JobApplicationsService],
})
export class JobApplicationsModule {}
