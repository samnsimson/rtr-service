import { Module } from '@nestjs/common';
import { RtrService } from './rtr.service';
import { RtrResolver } from './rtr.resolver';

@Module({
  providers: [RtrResolver, RtrService],
})
export class RtrModule {}
