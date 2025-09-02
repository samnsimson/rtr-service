import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RTRService } from './rtr.service';
import { RTRResolver } from './rtr.resolver';
import { RTR } from './entities/rtr.entity';
import { CandidateProfile } from '../candidate-profile/entities/candidate-profile.entity';
import { RecruiterProfile } from '../recruiter-profile/entities/recruiter-profile.entity';
import { Job } from '../jobs/entities/job.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { RTRHistory } from '../rtr-history/entities/rtr-history.entity';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([RTR, CandidateProfile, RecruiterProfile, Job, Organization, RTRHistory]), ConfigModule, EmailModule],
  providers: [RTRResolver, RTRService],
  exports: [RTRService],
})
export class RTRModule {}
