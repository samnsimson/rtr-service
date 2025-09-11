import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsService } from './jobs.service';
import { JobsResolver } from './jobs.resolver';
import { Job } from './entities/job.entity';
import { RecruiterProfile } from '../recruiter-profile/entities/recruiter-profile.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { UsersModule } from 'src/users/users.module';
import { RecruiterProfileModule } from 'src/recruiter-profile/recruiter-profile.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job, RecruiterProfile, Organization]),
    forwardRef(() => UsersModule),
    forwardRef(() => OrganizationsModule),
    forwardRef(() => RecruiterProfileModule),
  ],
  providers: [JobsResolver, JobsService],
})
export class JobsModule {}
