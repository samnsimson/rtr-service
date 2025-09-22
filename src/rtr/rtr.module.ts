import { Module, forwardRef } from '@nestjs/common';
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
import { JobsModule } from 'src/jobs/jobs.module';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { CandidateProfileModule } from 'src/candidate-profile/candidate-profile.module';
import { RecruiterProfileModule } from 'src/recruiter-profile/recruiter-profile.module';
import { RtrTemplateModule } from 'src/rtr-template/rtr-template.module';
import { UsersModule } from 'src/users/users.module';
import { EventsModule } from '../common/events/events.module';
import { RTREventsListener } from './events/rtr.events';

@Module({
  imports: [
    TypeOrmModule.forFeature([RTR, CandidateProfile, RecruiterProfile, Job, Organization, RTRHistory]),
    EventsModule,
    forwardRef(() => ConfigModule),
    forwardRef(() => EmailModule),
    forwardRef(() => JobsModule),
    forwardRef(() => OrganizationsModule),
    forwardRef(() => CandidateProfileModule),
    forwardRef(() => RecruiterProfileModule),
    forwardRef(() => RtrTemplateModule),
    forwardRef(() => UsersModule),
  ],
  providers: [RTRResolver, RTRService, RTREventsListener],
  exports: [RTRService],
})
export class RTRModule {}
