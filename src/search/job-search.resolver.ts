import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JobSearchService, JobSearchFilters, JobSearchResult } from './job-search.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SearchResult, SearchOptions } from '../common/types/search.types';

// GraphQL input types
class JobSearchFiltersInput {
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

class SearchOptionsInput {
  limit?: number;
  offset?: number;
  sort?: string[];
}

class JobSearchResultType {
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

@Resolver(() => JobSearchResultType)
@UseGuards(JwtAuthGuard)
export class JobSearchResolver {
  constructor(private readonly jobSearchService: JobSearchService) {}

  @Query(() => SearchResult, { name: 'searchJobs' })
  async searchJobs(
    @Args('query') query: string,
    @Args('filters', { nullable: true }) filters?: JobSearchFiltersInput,
    @Args('options', { nullable: true }) options?: SearchOptionsInput,
  ): Promise<SearchResult<JobSearchResult>> {
    const searchFilters: JobSearchFilters = {
      workType: filters?.workType,
      jobType: filters?.jobType,
      compensation: filters?.compensation,
      location: filters?.location,
      status: filters?.status,
      recruiterId: filters?.recruiterId,
      salaryMin: filters?.salaryMin,
      salaryMax: filters?.salaryMax,
      hasBenefits: filters?.hasBenefits,
    };

    const searchOptions: SearchOptions = {
      limit: options?.limit,
      offset: options?.offset,
      sort: options?.sort,
    };

    return this.jobSearchService.searchJobs(query, searchFilters, searchOptions);
  }

  @Query(() => SearchResult, { name: 'searchJobsByLocation' })
  async searchJobsByLocation(
    @Args('location') location: string,
    @Args('options', { nullable: true }) options?: SearchOptionsInput,
  ): Promise<SearchResult<JobSearchResult>> {
    const searchOptions: SearchOptions = {
      limit: options?.limit,
      offset: options?.offset,
      sort: options?.sort,
    };

    return this.jobSearchService.searchJobsByLocation(location, searchOptions);
  }

  @Query(() => SearchResult, { name: 'searchJobsByWorkType' })
  async searchJobsByWorkType(
    @Args('workType', { type: () => [String] }) workType: string[],
    @Args('options', { nullable: true }) options?: SearchOptionsInput,
  ): Promise<SearchResult<JobSearchResult>> {
    const searchOptions: SearchOptions = {
      limit: options?.limit,
      offset: options?.offset,
      sort: options?.sort,
    };

    return this.jobSearchService.searchJobsByWorkType(workType, searchOptions);
  }

  @Query(() => SearchResult, { name: 'searchJobsBySalaryRange' })
  async searchJobsBySalaryRange(
    @Args('minSalary') minSalary: number,
    @Args('maxSalary') maxSalary: number,
    @Args('options', { nullable: true }) options?: SearchOptionsInput,
  ): Promise<SearchResult<JobSearchResult>> {
    const searchOptions: SearchOptions = {
      limit: options?.limit,
      offset: options?.offset,
      sort: options?.sort,
    };

    return this.jobSearchService.searchJobsBySalaryRange(minSalary, maxSalary, searchOptions);
  }

  @Query(() => SearchResult, { name: 'searchJobsByCompany' })
  async searchJobsByCompany(
    @Args('company') company: string,
    @Args('options', { nullable: true }) options?: SearchOptionsInput,
  ): Promise<SearchResult<JobSearchResult>> {
    const searchOptions: SearchOptions = {
      limit: options?.limit,
      offset: options?.offset,
      sort: options?.sort,
    };

    return this.jobSearchService.searchJobsByCompany(company, searchOptions);
  }

  @Query(() => SearchResult, { name: 'searchJobsBySkills' })
  async searchJobsBySkills(
    @Args('skills', { type: () => [String] }) skills: string[],
    @Args('options', { nullable: true }) options?: SearchOptionsInput,
  ): Promise<SearchResult<JobSearchResult>> {
    const searchOptions: SearchOptions = {
      limit: options?.limit,
      offset: options?.offset,
      sort: options?.sort,
    };

    return this.jobSearchService.searchJobsBySkills(skills, searchOptions);
  }

  @Query(() => [JobSearchResultType], { name: 'getRecentJobs' })
  async getRecentJobs(@Args('limit', { nullable: true }) limit?: number): Promise<JobSearchResult[]> {
    return this.jobSearchService.getRecentJobs(limit);
  }

  @Query(() => SearchResult, { name: 'getJobsByRecruiter' })
  async getJobsByRecruiter(
    @Args('recruiterId') recruiterId: string,
    @Args('options', { nullable: true }) options?: SearchOptionsInput,
  ): Promise<SearchResult<JobSearchResult>> {
    const searchOptions: SearchOptions = {
      limit: options?.limit,
      offset: options?.offset,
      sort: options?.sort,
    };

    return this.jobSearchService.getJobsByRecruiter(recruiterId, searchOptions);
  }

  @Query(() => SearchResult, { name: 'getActiveJobs' })
  async getActiveJobs(@Args('options', { nullable: true }) options?: SearchOptionsInput): Promise<SearchResult<JobSearchResult>> {
    const searchOptions: SearchOptions = {
      limit: options?.limit,
      offset: options?.offset,
      sort: options?.sort,
    };

    return this.jobSearchService.getActiveJobs(searchOptions);
  }

  @Query(() => SearchResult, { name: 'getExpiringJobs' })
  async getExpiringJobs(
    @Args('daysUntilExpiry', { nullable: true }) daysUntilExpiry?: number,
    @Args('options', { nullable: true }) options?: SearchOptionsInput,
  ): Promise<SearchResult<JobSearchResult>> {
    const searchOptions: SearchOptions = {
      limit: options?.limit,
      offset: options?.offset,
      sort: options?.sort,
    };

    return this.jobSearchService.getExpiringJobs(daysUntilExpiry, searchOptions);
  }
}
