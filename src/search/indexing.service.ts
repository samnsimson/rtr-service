import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchService } from './search.service';
import { DocumentToIndex } from '../common/types/search.types';
import { Job } from '../jobs/entities/job.entity';
import { User } from '../users/entities/user.entity';
import { CandidateProfile } from '../candidate-profile/entities/candidate-profile.entity';
import { RecruiterProfile } from '../recruiter-profile/entities/recruiter-profile.entity';

@Injectable()
export class IndexingService {
  private readonly logger = new Logger(IndexingService.name);

  constructor(
    private readonly searchService: SearchService,
    @InjectRepository(Job) private readonly jobRepo: Repository<Job>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(CandidateProfile) private readonly candidateProfileRepo: Repository<CandidateProfile>,
    @InjectRepository(RecruiterProfile) private readonly recruiterProfileRepo: Repository<RecruiterProfile>,
  ) {}

  async indexJobs(batchSize: number = 100): Promise<void> {
    try {
      this.logger.log('Starting job indexing...');
      let offset = 0;
      let hasMore = true;

      while (hasMore) {
        const jobs = await this.jobRepo.find({ skip: offset, take: batchSize, relations: ['recruiter'] });
        if (jobs.length === 0) {
          hasMore = false;
          break;
        }

        const documents: DocumentToIndex[] = jobs.map((job) => ({
          id: job.id,
          title: job.title,
          company: job.company,
          description: job.description,
          requirements: job.requirements,
          location: job.location,
          workType: job.workType,
          jobType: job.jobType,
          compensation: job.compensation,
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          benefits: job.benefits,
          recruiterId: job.recruiterId,
          status: job.status,
          expiresAt: job.expiresAt,
          createdAt: job.createdAt,
          updatedAt: job.updatedAt,
        }));

        await this.searchService.addDocuments('jobs', documents);
        this.logger.log(`Indexed ${documents.length} jobs (offset: ${offset})`);
        offset += batchSize;
        hasMore = jobs.length === batchSize;
      }

      this.logger.log('Job indexing completed successfully');
    } catch (error) {
      this.logger.error('Failed to index jobs', error);
      throw error;
    }
  }

  async indexUsers(batchSize: number = 100): Promise<void> {
    try {
      this.logger.log('Starting user indexing...');

      let offset = 0;
      let hasMore = true;

      while (hasMore) {
        const users = await this.userRepo.find({ skip: offset, take: batchSize });
        if (users.length === 0) {
          hasMore = false;
          break;
        }

        const documents: DocumentToIndex[] = users.map((user) => ({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          phone: user.phone,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }));

        await this.searchService.addDocuments('users', documents);
        this.logger.log(`Indexed ${documents.length} users (offset: ${offset})`);
        offset += batchSize;
        hasMore = users.length === batchSize;
      }

      this.logger.log('User indexing completed successfully');
    } catch (error) {
      this.logger.error('Failed to index users', error);
      throw error;
    }
  }

  async indexCandidateProfiles(batchSize: number = 100): Promise<void> {
    try {
      this.logger.log('Starting candidate profile indexing...');
      let offset = 0;
      let hasMore = true;

      while (hasMore) {
        const profiles = await this.candidateProfileRepo.find({ skip: offset, take: batchSize, relations: ['user'] });
        if (profiles.length === 0) {
          hasMore = false;
          break;
        }

        const documents: DocumentToIndex[] = profiles.map((profile) => ({
          id: profile.id,
          userId: profile.userId,
          title: profile.title,
          skills: profile.skills,
          experience: profile.experience,
          remotePreference: profile.remotePreference,
          location: profile.location,
          createdAt: profile.createdAt,
          updatedAt: profile.updatedAt,
        }));

        await this.searchService.addDocuments('candidate_profiles', documents);
        this.logger.log(`Indexed ${documents.length} candidate profiles (offset: ${offset})`);
        offset += batchSize;
        hasMore = profiles.length === batchSize;
      }

      this.logger.log('Candidate profile indexing completed successfully');
    } catch (error) {
      this.logger.error('Failed to index candidate profiles', error);
      throw error;
    }
  }

  async indexRecruiterProfiles(batchSize: number = 100): Promise<void> {
    try {
      this.logger.log('Starting recruiter profile indexing...');
      let offset = 0;
      let hasMore = true;

      while (hasMore) {
        const profiles = await this.recruiterProfileRepo.find({ skip: offset, take: batchSize, relations: ['user'] });
        if (profiles.length === 0) {
          hasMore = false;
          break;
        }

        const documents: DocumentToIndex[] = profiles.map((profile) => ({
          id: profile.id,
          userId: profile.userId,
          companyName: profile.companyName,
          companyWebsite: profile.companyWebsite,
          industry: profile.industry,
          companySize: profile.companySize,
          location: profile.location,
          bio: profile.bio,
          linkedinUrl: profile.linkedinUrl,
          createdAt: profile.createdAt,
          updatedAt: profile.updatedAt,
        }));

        await this.searchService.addDocuments('recruiter_profiles', documents);
        this.logger.log(`Indexed ${documents.length} recruiter profiles (offset: ${offset})`);
        offset += batchSize;
        hasMore = profiles.length === batchSize;
      }

      this.logger.log('Recruiter profile indexing completed successfully');
    } catch (error) {
      this.logger.error('Failed to index recruiter profiles', error);
      throw error;
    }
  }

  async reindexAll(batchSize: number = 100): Promise<void> {
    try {
      this.logger.log('Starting full reindex...');

      // Clear all indexes first
      await this.searchService.deleteAllDocuments('jobs');
      await this.searchService.deleteAllDocuments('users');
      await this.searchService.deleteAllDocuments('candidate_profiles');
      await this.searchService.deleteAllDocuments('recruiter_profiles');

      // Reindex all entities
      await Promise.all([
        this.indexJobs(batchSize),
        this.indexUsers(batchSize),
        this.indexCandidateProfiles(batchSize),
        this.indexRecruiterProfiles(batchSize),
      ]);

      this.logger.log('Full reindex completed successfully');
    } catch (error) {
      this.logger.error('Failed to perform full reindex', error);
      throw error;
    }
  }

  async indexSingleJob(jobId: string): Promise<void> {
    try {
      const job = await this.jobRepo.findOne({ where: { id: jobId }, relations: ['recruiter'] });
      if (!job) throw new Error(`Job with id ${jobId} not found`);
      await this.searchService.addDocuments('jobs', [
        {
          id: job.id,
          title: job.title,
          company: job.company,
          description: job.description,
          requirements: job.requirements,
          location: job.location,
          workType: job.workType,
          jobType: job.jobType,
          compensation: job.compensation,
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          benefits: job.benefits,
          recruiterId: job.recruiterId,
          status: job.status,
          expiresAt: job.expiresAt,
          createdAt: job.createdAt,
          updatedAt: job.updatedAt,
        },
      ]);
      this.logger.log(`Indexed single job: ${jobId}`);
    } catch (error) {
      this.logger.error(`Failed to index single job ${jobId}`, error);
      throw error;
    }
  }

  async removeJobFromIndex(jobId: string): Promise<void> {
    try {
      await this.searchService.deleteDocuments('jobs', [jobId]);
      this.logger.log(`Removed job from index: ${jobId}`);
    } catch (error) {
      this.logger.error(`Failed to remove job from index ${jobId}`, error);
      throw error;
    }
  }

  async updateJobInIndex(jobId: string): Promise<void> {
    try {
      // Remove the old document and add the updated one
      await this.removeJobFromIndex(jobId);
      await this.indexSingleJob(jobId);
      this.logger.log(`Updated job in index: ${jobId}`);
    } catch (error) {
      this.logger.error(`Failed to update job in index ${jobId}`, error);
      throw error;
    }
  }
}
