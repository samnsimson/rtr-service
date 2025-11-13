import { Module } from '@nestjs/common';
import { EmployerListService } from './employer-list.service';
import { EmployerListResolver } from './employer-list.resolver';

@Module({
  providers: [EmployerListResolver, EmployerListService],
})
export class EmployerListModule {}
