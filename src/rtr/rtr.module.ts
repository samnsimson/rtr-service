import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RTRService } from './rtr.service';
import { RTRResolver } from './rtr.resolver';
import { RTR } from './entities/rtr.entity';
import { Organization } from '../organizations/entities/organization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RTR, Organization])],
  providers: [RTRResolver, RTRService],
})
export class RTRModule {}
