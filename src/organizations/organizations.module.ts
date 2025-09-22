import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsService } from './organizations.service';
import { OrganizationsResolver } from './organizations.resolver';
import { Organization } from './entities/organization.entity';
import { User } from '../users/entities/user.entity';
import { EventsModule } from '../common/events/events.module';
import { OrganizationEventsListener } from './events/organization.events';
import { OverviewModule } from '../overview/overview.module';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, User]), EventsModule, forwardRef(() => OverviewModule)],
  providers: [OrganizationsService, OrganizationsResolver, OrganizationEventsListener],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
