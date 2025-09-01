import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchService } from './search.service';
import { IndexingService } from './indexing.service';
import { JobSearchService } from './job-search.service';
import { SearchResolver } from './search.resolver';
import { IndexingResolver } from './indexing.resolver';
import { JobSearchResolver } from './job-search.resolver';
import { Job } from '../jobs/entities/job.entity';
import { User } from '../users/entities/user.entity';
import { CandidateProfile } from '../candidate-profile/entities/candidate-profile.entity';
import { RecruiterProfile } from '../recruiter-profile/entities/recruiter-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job, User, CandidateProfile, RecruiterProfile])],
  providers: [SearchService, IndexingService, JobSearchService, SearchResolver, IndexingResolver, JobSearchResolver],
  exports: [SearchService, IndexingService, JobSearchService],
})
export class SearchModule {}
