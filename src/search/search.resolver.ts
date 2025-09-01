import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums';
import { SearchResult, IndexStats } from '../common/types/search.types';
import { Index, IndexesResults } from 'meilisearch';

// GraphQL types
class SearchResultType<T = any> {
  hits: T[];
  estimatedTotalHits: number;
  processingTimeMs: number;
  query: string;
  limit: number;
  offset: number;
}

class IndexConfigType {
  name: string;
  primaryKey?: string;
  searchableAttributes?: string[];
  filterableAttributes?: string[];
  sortableAttributes?: string[];
  rankingRules?: string[];
  distinctAttribute?: string;
  stopWords?: string[];
  synonyms?: Record<string, string[]>;
}

class DocumentToIndexType {
  id: string;
  [key: string]: any;
}

class IndexStatsType {
  numberOfDocuments: number;
  isIndexing: boolean;
  fieldDistribution: Record<string, number>;
}

class SearchOptionsType {
  limit?: number;
  offset?: number;
  filter?: string | string[];
  sort?: string[];
  attributesToRetrieve?: string[];
  attributesToHighlight?: string[];
  attributesToCrop?: string[];
  cropLength?: number;
  highlightPreTag?: string;
  highlightPostTag?: string;
}

class IndexType {
  name: string;
  primaryKey?: string;
  searchableAttributes?: string[];
  filterableAttributes?: string[];
  sortableAttributes?: string[];
}

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
    @Args('options', { nullable: true }) options?: SearchOptionsType,
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

  @Mutation(() => Boolean, { name: 'createIndex' })
  @Roles(UserRole.ADMIN)
  async createIndex(@Args('config') config: IndexConfigType): Promise<boolean> {
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
    @Args('documents', { type: () => [DocumentToIndexType] }) documents: DocumentToIndexType[],
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
    @Args('documents', { type: () => [DocumentToIndexType] }) documents: DocumentToIndexType[],
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
    @Args('documents', { type: () => [DocumentToIndexType] }) documents: DocumentToIndexType[],
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
