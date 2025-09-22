import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OverviewService } from './overview.service';
import { OverviewResolver } from './overview.resolver';
import { Overview } from './entities/overview.entity';
import { OrganizationsModule } from '../organizations/organizations.module';
import { RTRModule } from '../rtr/rtr.module';
import { JobsModule } from '../jobs/jobs.module';
import { JobApplicationsModule } from '../job-applications/job-applications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Overview]),
    forwardRef(() => OrganizationsModule),
    forwardRef(() => RTRModule),
    forwardRef(() => JobsModule),
    forwardRef(() => JobApplicationsModule),
  ],
  providers: [OverviewResolver, OverviewService],
  exports: [OverviewService],
})
export class OverviewModule {}
