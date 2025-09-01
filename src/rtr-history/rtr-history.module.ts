import { Module } from '@nestjs/common';
import { RtrHistoryService } from './rtr-history.service';
import { RtrHistoryResolver } from './rtr-history.resolver';

@Module({
  providers: [RtrHistoryResolver, RtrHistoryService],
})
export class RtrHistoryModule {}
