import { Module } from '@nestjs/common';
import { RTRHistoryService } from './rtr-history.service';
import { RTRHistoryResolver } from './rtr-history.resolver';

@Module({
  providers: [RTRHistoryResolver, RTRHistoryService],
})
export class RTRHistoryModule {}
