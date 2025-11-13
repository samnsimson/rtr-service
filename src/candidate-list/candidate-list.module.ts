import { Module } from '@nestjs/common';
import { CandidateListsResolver } from './candidate-list.resolver';
import { CandidateListsService } from './candidate-list.service';

@Module({
  providers: [CandidateListsResolver, CandidateListsService],
})
export class CandidateListsModule {}
