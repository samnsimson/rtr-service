import { Module } from '@nestjs/common';
import { RTRService } from './rtr.service';
import { RTRResolver } from './rtr.resolver';

@Module({
  providers: [RTRResolver, RTRService],
})
export class RTRModule {}
