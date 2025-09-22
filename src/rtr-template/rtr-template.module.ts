import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RtrTemplateService } from './rtr-template.service';
import { RtrTemplateResolver } from './rtr-template.resolver';
import { RtrTemplate } from './entities/rtr-template.entity';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { JobsModule } from 'src/jobs/jobs.module';

@Module({
  imports: [TypeOrmModule.forFeature([RtrTemplate]), forwardRef(() => OrganizationsModule), forwardRef(() => JobsModule)],
  providers: [RtrTemplateResolver, RtrTemplateService],
  exports: [RtrTemplateService],
})
export class RtrTemplateModule {}
