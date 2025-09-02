import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RTRHistoryService } from './rtr-history.service';
import { RTRHistoryResolver } from './rtr-history.resolver';
import { RTRHistory } from './entities/rtr-history.entity';
import { Organization } from '../organizations/entities/organization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RTRHistory, Organization])],
  providers: [RTRHistoryResolver, RTRHistoryService],
})
export class RTRHistoryModule {}
