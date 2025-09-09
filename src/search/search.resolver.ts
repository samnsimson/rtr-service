import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums';
import { SearchResult, IndexStats } from '../common/types/search.types';
import { Index, IndexesResults } from 'meilisearch';
import { SearchResultType, IndexStatsType, SearchOptionsInput, IndexConfigInput, DocumentToIndexInput, JobSearchFiltersInput, IndexType } from './dto';

@Resolver(() => SearchResultType)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.RECRUITER, UserRole.CANDIDATE)
export class SearchResolver {
  constructor(private readonly searchService: SearchService) {}

  @Query(() => [IndexType], { name: 'listIndexes' })
  @Roles(UserRole.ADMIN)
  async listIndexes(): Promise<IndexesResults<Array<Index>>> {
    return this.searchService.listIndexes();
  }

  @Query(() => IndexStatsType, { name: 'getIndexStats' })
  @Roles(UserRole.ADMIN)
  async getIndexStats(@Args('indexName') indexName: string): Promise<IndexStats> {
    return this.searchService.getIndexStats(indexName);
  }

  @Query(() => SearchResultType, { name: 'search' })
  async search(
    @Args('indexName') indexName: string,
    @Args('query') query: string,
    @Args('options', { nullable: true }) options?: SearchOptionsInput,
  ): Promise<SearchResult> {
    return this.searchService.search(indexName, query, {
      limit: options?.limit,
      offset: options?.offset,
      filter: options?.filter,
      sort: options?.sort,
      attributesToRetrieve: options?.attributesToRetrieve,
      attributesToHighlight: options?.attributesToHighlight,
      attributesToCrop: options?.attributesToCrop,
      cropLength: options?.cropLength,
      highlightPreTag: options?.highlightPreTag,
      highlightPostTag: options?.highlightPostTag,
    });
  }

  @Query(() => SearchResultType, { name: 'searchJobs' })
  async searchJobs(
    @Args('query') query: string,
    @Args('filters', { nullable: true }) filters?: JobSearchFiltersInput,
    @Args('options', { nullable: true }) options?: SearchOptionsInput,
  ): Promise<SearchResult> {
    const filterParts: string[] = [];
    if (filters?.workType && filters.workType.length > 0) filterParts.push(`workType IN [${filters.workType.map((t) => `"${t}"`).join(', ')}]`);
    if (filters?.jobType && filters.jobType.length > 0) filterParts.push(`jobType IN [${filters.jobType.map((t) => `"${t}"`).join(', ')}]`);
    if (filters?.compensation && filters.compensation.length > 0) filterParts.push(`compensation IN [${filters.compensation.map((c) => `"${c}"`).join(', ')}]`);
    if (filters?.location) filterParts.push(`location = "${filters.location}"`);
    if (filters?.status) filterParts.push(`status = "${filters.status}"`);
    if (filters?.recruiterId) filterParts.push(`recruiterId = "${filters.recruiterId}"`);
    if (filters?.salaryMin !== undefined) filterParts.push(`salaryMin >= ${filters.salaryMin}`);
    if (filters?.salaryMax !== undefined) filterParts.push(`salaryMax <= ${filters.salaryMax}`);
    const filterString = filterParts.length > 0 ? filterParts.join(' AND ') : undefined;

    return this.searchService.search('jobs', query, {
      limit: options?.limit,
      offset: options?.offset,
      filter: filterString,
      sort: options?.sort,
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
        'status',
        'expiresAt',
      ],
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>',
    });
  }

  @Query(() => SearchResultType, { name: 'searchJobsByLocation' })
  async searchJobsByLocation(@Args('location') location: string, @Args('options', { nullable: true }) options?: SearchOptionsInput): Promise<SearchResult> {
    return this.searchService.search('jobs', '', {
      limit: options?.limit,
      offset: options?.offset,
      sort: options?.sort,
      filter: `location = "${location}"`,
    });
  }

  @Query(() => SearchResultType, { name: 'searchJobsByWorkType' })
  async searchJobsByWorkType(
    @Args('workType', { type: () => [String] }) workType: string[],
    @Args('options', { nullable: true }) options?: SearchOptionsInput,
  ): Promise<SearchResult> {
    return this.searchService.search('jobs', '', {
      limit: options?.limit,
      offset: options?.offset,
      sort: options?.sort,
      filter: `workType IN [${workType.map((t) => `"${t}"`).join(', ')}]`,
    });
  }

  @Query(() => SearchResultType, { name: 'searchJobsBySalaryRange' })
  async searchJobsBySalaryRange(
    @Args('minSalary') minSalary: number,
    @Args('maxSalary') maxSalary: number,
    @Args('options', { nullable: true }) options?: SearchOptionsInput,
  ): Promise<SearchResult> {
    return this.searchService.search('jobs', '', {
      limit: options?.limit,
      offset: options?.offset,
      sort: options?.sort,
      filter: `salaryMin >= ${minSalary} AND salaryMax <= ${maxSalary}`,
    });
  }

  @Query(() => SearchResultType, { name: 'searchJobsByCompany' })
  async searchJobsByCompany(@Args('company') company: string, @Args('options', { nullable: true }) options?: SearchOptionsInput): Promise<SearchResult> {
    return this.searchService.search('jobs', company, {
      limit: options?.limit,
      offset: options?.offset,
      sort: options?.sort,
    });
  }

  @Query(() => SearchResultType, { name: 'searchJobsBySkills' })
  async searchJobsBySkills(
    @Args('skills', { type: () => [String] }) skills: string[],
    @Args('options', { nullable: true }) options?: SearchOptionsInput,
  ): Promise<SearchResult> {
    const skillsQuery = skills.join(' ');
    return this.searchService.search('jobs', skillsQuery, {
      limit: options?.limit,
      offset: options?.offset,
      sort: options?.sort,
    });
  }

  @Query(() => SearchResultType, { name: 'getRecentJobs' })
  async getRecentJobs(@Args('limit', { nullable: true }) limit?: number): Promise<SearchResult> {
    return this.searchService.search('jobs', '', {
      limit: limit || 10,
      sort: ['createdAt:desc'],
    });
  }

  @Query(() => SearchResultType, { name: 'getJobsByRecruiter' })
  async getJobsByRecruiter(@Args('recruiterId') recruiterId: string, @Args('options', { nullable: true }) options?: SearchOptionsInput): Promise<SearchResult> {
    return this.searchService.search('jobs', '', {
      limit: options?.limit,
      offset: options?.offset,
      sort: options?.sort,
      filter: `recruiterId = "${recruiterId}"`,
    });
  }

  @Query(() => SearchResultType, { name: 'getActiveJobs' })
  async getActiveJobs(@Args('options', { nullable: true }) options?: SearchOptionsInput): Promise<SearchResult> {
    return this.searchService.search('jobs', '', {
      limit: options?.limit,
      offset: options?.offset,
      sort: options?.sort,
      filter: 'status = "ACTIVE"',
    });
  }

  @Query(() => SearchResultType, { name: 'getExpiringJobs' })
  async getExpiringJobs(
    @Args('daysUntilExpiry', { nullable: true }) daysUntilExpiry?: number,
    @Args('options', { nullable: true }) options?: SearchOptionsInput,
  ): Promise<SearchResult> {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + (daysUntilExpiry || 7));

    const filterString = `expiresAt <= "${expiryDate.toISOString()}" AND status = "ACTIVE"`;

    return this.searchService.search('jobs', '', {
      ...options,
      filter: filterString,
      sort: ['expiresAt:asc'],
    });
  }

  @Mutation(() => Boolean, { name: 'createIndex' })
  @Roles(UserRole.ADMIN)
  async createIndex(@Args('config') config: IndexConfigInput): Promise<boolean> {
    try {
      await this.searchService.createIndex({
        name: config.name,
        primaryKey: config.primaryKey,
        searchableAttributes: config.searchableAttributes,
        filterableAttributes: config.filterableAttributes,
        sortableAttributes: config.sortableAttributes,
        rankingRules: config.rankingRules,
        distinctAttribute: config.distinctAttribute,
        stopWords: config.stopWords,
        synonyms: config.synonyms,
      });
      return true;
    } catch (error: any) {
      console.log('🚀 ~ SearchResolver ~ createIndex ~ error:', error);
      return false;
    }
  }

  @Mutation(() => Boolean, { name: 'addDocuments' })
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  async addDocuments(
    @Args('indexName') indexName: string,
    @Args('documents', { type: () => [DocumentToIndexInput] }) documents: DocumentToIndexInput[],
  ): Promise<boolean> {
    try {
      await this.searchService.addDocuments(indexName, documents);
      return true;
    } catch (error: any) {
      console.log('🚀 ~ SearchResolver ~ addDocuments ~ error:', error);
      return false;
    }
  }

  @Mutation(() => Boolean, { name: 'updateDocuments' })
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  async updateDocuments(
    @Args('indexName') indexName: string,
    @Args('documents', { type: () => [DocumentToIndexInput] }) documents: DocumentToIndexInput[],
  ): Promise<boolean> {
    try {
      await this.searchService.updateDocuments(indexName, documents);
      return true;
    } catch (error: any) {
      console.log('🚀 ~ SearchResolver ~ updateDocuments ~ error:', error);
      return false;
    }
  }

  @Mutation(() => Boolean, { name: 'deleteDocuments' })
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  async deleteDocuments(@Args('indexName') indexName: string, @Args('documentIds', { type: () => [String] }) documentIds: string[]): Promise<boolean> {
    try {
      await this.searchService.deleteDocuments(indexName, documentIds);
      return true;
    } catch (error: any) {
      console.log('🚀 ~ SearchResolver ~ deleteDocuments ~ error:', error);
      return false;
    }
  }

  @Mutation(() => Boolean, { name: 'deleteAllDocuments' })
  @Roles(UserRole.ADMIN)
  async deleteAllDocuments(@Args('indexName') indexName: string): Promise<boolean> {
    try {
      await this.searchService.deleteAllDocuments(indexName);
      return true;
    } catch (error: any) {
      console.log('🚀 ~ SearchResolver ~ deleteAllDocuments ~ error:', error);
      return false;
    }
  }

  @Mutation(() => Boolean, { name: 'reindex' })
  @Roles(UserRole.ADMIN)
  async reindex(
    @Args('indexName') indexName: string,
    @Args('documents', { type: () => [DocumentToIndexInput] }) documents: DocumentToIndexInput[],
  ): Promise<boolean> {
    try {
      await this.searchService.reindex(indexName, documents);
      return true;
    } catch (error: any) {
      console.log('🚀 ~ SearchResolver ~ reindex ~ error:', error);
      return false;
    }
  }

  @Mutation(() => Boolean, { name: 'deleteIndex' })
  @Roles(UserRole.ADMIN)
  async deleteIndex(@Args('indexName') indexName: string): Promise<boolean> {
    try {
      await this.searchService.deleteIndex(indexName);
      return true;
    } catch (error: any) {
      console.log('🚀 ~ SearchResolver ~ deleteIndex ~ error:', error);
      return false;
    }
  }
}
