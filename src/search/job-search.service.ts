import { Injectable, Logger } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchResult, SearchOptions } from '../common/types/search.types';

export interface JobSearchFilters {
  workType?: string[];
  jobType?: string[];
  compensation?: string[];
  location?: string;
  status?: string;
  recruiterId?: string;
  salaryMin?: number;
  salaryMax?: number;
  hasBenefits?: boolean;
}

export interface JobSearchResult {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  location: string;
  workType: string;
  jobType: string;
  compensation: string;
  salaryMin?: number;
  salaryMax?: number;
  benefits: string[];
  recruiterId: string;
  status: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  _formatted?: {
    title?: string;
    description?: string;
    requirements?: string[];
    company?: string;
  };
}

@Injectable()
export class JobSearchService {
  private readonly logger = new Logger(JobSearchService.name);

  constructor(private readonly searchService: SearchService) {}

  async searchJobs(query: string, filters: JobSearchFilters = {}, options: SearchOptions = {}): Promise<SearchResult<JobSearchResult>> {
    try {
      // Build filter string for Meilisearch
      const filterParts: string[] = [];

      if (filters.workType && filters.workType.length > 0) {
        filterParts.push(`workType IN [${filters.workType.map((t) => `"${t}"`).join(', ')}]`);
      }

      if (filters.jobType && filters.jobType.length > 0) {
        filterParts.push(`jobType IN [${filters.jobType.map((t) => `"${t}"`).join(', ')}]`);
      }

      if (filters.compensation && filters.compensation.length > 0) {
        filterParts.push(`compensation IN [${filters.compensation.map((c) => `"${c}"`).join(', ')}]`);
      }

      if (filters.location) {
        filterParts.push(`location = "${filters.location}"`);
      }

      if (filters.status) {
        filterParts.push(`status = "${filters.status}"`);
      }

      if (filters.recruiterId) {
        filterParts.push(`recruiterId = "${filters.recruiterId}"`);
      }

      if (filters.salaryMin !== undefined) {
        filterParts.push(`salaryMin >= ${filters.salaryMin}`);
      }

      if (filters.salaryMax !== undefined) {
        filterParts.push(`salaryMax <= ${filters.salaryMax}`);
      }

      // Combine all filters
      const filterString = filterParts.length > 0 ? filterParts.join(' AND ') : undefined;

      // Set up search options with highlighting
      const searchOptions: SearchOptions = {
        ...options,
        filter: filterString,
        attributesToHighlight: ['title', 'description', 'requirements', 'company'],
        attributesToRetrieve: [
          'id',
          'title',
          'company',
          'description',
          'requirements',
          'location',
          'workType',
          'jobType',
          'compensation',
          'salaryMin',
          'salaryMax',
          'benefits',
          'recruiterId',
          'status',
          'expiresAt',
          'createdAt',
          'updatedAt',
        ],
        highlightPreTag: '<mark>',
        highlightPostTag: '</mark>',
      };

      const result = await this.searchService.search<JobSearchResult>('jobs', query, searchOptions);

      this.logger.log(`Job search completed: ${result.hits.length} results for query "${query}"`);
      return result;
    } catch (error) {
      this.logger.error('Job search failed', error);
      throw error;
    }
  }

  async searchJobsByLocation(location: string, options: SearchOptions = {}): Promise<SearchResult<JobSearchResult>> {
    return this.searchJobs('', { location }, options);
  }

  async searchJobsByWorkType(workType: string[], options: SearchOptions = {}): Promise<SearchResult<JobSearchResult>> {
    return this.searchJobs('', { workType }, options);
  }

  async searchJobsBySalaryRange(minSalary: number, maxSalary: number, options: SearchOptions = {}): Promise<SearchResult<JobSearchResult>> {
    return this.searchJobs('', { salaryMin: minSalary, salaryMax: maxSalary }, options);
  }

  async searchJobsByCompany(company: string, options: SearchOptions = {}): Promise<SearchResult<JobSearchResult>> {
    return this.searchJobs(company, {}, options);
  }

  async searchJobsBySkills(skills: string[], options: SearchOptions = {}): Promise<SearchResult<JobSearchResult>> {
    const skillsQuery = skills.join(' ');
    return this.searchJobs(skillsQuery, {}, options);
  }

  async getRecentJobs(limit: number = 10): Promise<JobSearchResult[]> {
    try {
      const result = await this.searchService.search<JobSearchResult>('jobs', '', {
        limit,
        sort: ['createdAt:desc'],
      });

      return result.hits;
    } catch (error) {
      this.logger.error('Failed to get recent jobs', error);
      throw error;
    }
  }

  async getJobsByRecruiter(recruiterId: string, options: SearchOptions = {}): Promise<SearchResult<JobSearchResult>> {
    return this.searchJobs('', { recruiterId }, options);
  }

  async getActiveJobs(options: SearchOptions = {}): Promise<SearchResult<JobSearchResult>> {
    return this.searchJobs('', { status: 'ACTIVE' }, options);
  }

  async getExpiringJobs(daysUntilExpiry: number = 7, options: SearchOptions = {}): Promise<SearchResult<JobSearchResult>> {
    try {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + daysUntilExpiry);

      const filterString = `expiresAt <= "${expiryDate.toISOString()}" AND status = "ACTIVE"`;

      const result = await this.searchService.search<JobSearchResult>('jobs', '', {
        ...options,
        filter: filterString,
        sort: ['expiresAt:asc'],
      });

      return result;
    } catch (error) {
      this.logger.error('Failed to get expiring jobs', error);
      throw error;
    }
  }
}
