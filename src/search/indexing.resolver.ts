import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { IndexingService } from './indexing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums';

@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class IndexingResolver {
  constructor(private readonly indexingService: IndexingService) {}

  @Mutation(() => Boolean, { name: 'indexJobs' })
  async indexJobs(@Args('batchSize', { nullable: true }) batchSize?: number): Promise<boolean> {
    try {
      await this.indexingService.indexJobs(batchSize);
      return true;
    } catch (error: any) {
      console.log('🚀 ~ IndexingResolver ~ indexJobs ~ error:', error);
      return false;
    }
  }

  @Mutation(() => Boolean, { name: 'indexUsers' })
  async indexUsers(@Args('batchSize', { nullable: true }) batchSize?: number): Promise<boolean> {
    try {
      await this.indexingService.indexUsers(batchSize);
      return true;
    } catch (error: any) {
      console.log('🚀 ~ IndexingResolver ~ indexUsers ~ error:', error);
      return false;
    }
  }

  @Mutation(() => Boolean, { name: 'indexCandidateProfiles' })
  async indexCandidateProfiles(@Args('batchSize', { nullable: true }) batchSize?: number): Promise<boolean> {
    try {
      await this.indexingService.indexCandidateProfiles(batchSize);
      return true;
    } catch (error: any) {
      console.log('🚀 ~ IndexingResolver ~ indexCandidateProfiles ~ error:', error);
      return false;
    }
  }

  @Mutation(() => Boolean, { name: 'indexRecruiterProfiles' })
  async indexRecruiterProfiles(@Args('batchSize', { nullable: true }) batchSize?: number): Promise<boolean> {
    try {
      await this.indexingService.indexRecruiterProfiles(batchSize);
      return true;
    } catch (error: any) {
      console.log('🚀 ~ IndexingResolver ~ indexRecruiterProfiles ~ error:', error);
      return false;
    }
  }

  @Mutation(() => Boolean, { name: 'reindexAll' })
  async reindexAll(@Args('batchSize', { nullable: true }) batchSize?: number): Promise<boolean> {
    try {
      await this.indexingService.reindexAll(batchSize);
      return true;
    } catch (error: any) {
      console.log('🚀 ~ IndexingResolver ~ reindexAll ~ error:', error);
      return false;
    }
  }

  @Mutation(() => Boolean, { name: 'indexSingleJob' })
  async indexSingleJob(@Args('jobId') jobId: string): Promise<boolean> {
    try {
      await this.indexingService.indexSingleJob(jobId);
      return true;
    } catch (error: any) {
      console.log('🚀 ~ IndexingResolver ~ indexSingleJob ~ error:', error);
      return false;
    }
  }

  @Mutation(() => Boolean, { name: 'removeJobFromIndex' })
  async removeJobFromIndex(@Args('jobId') jobId: string): Promise<boolean> {
    try {
      await this.indexingService.removeJobFromIndex(jobId);
      return true;
    } catch (error: any) {
      console.log('🚀 ~ IndexingResolver ~ removeJobFromIndex ~ error:', error);
      return false;
    }
  }

  @Mutation(() => Boolean, { name: 'updateJobInIndex' })
  async updateJobInIndex(@Args('jobId') jobId: string): Promise<boolean> {
    try {
      await this.indexingService.updateJobInIndex(jobId);
      return true;
    } catch (error: any) {
      console.log('🚀 ~ IndexingResolver ~ updateJobInIndex ~ error:', error);
      return false;
    }
  }
}
