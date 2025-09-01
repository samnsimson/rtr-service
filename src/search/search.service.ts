import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Index, MeiliSearchError, MeiliSearch, IndexesResults } from 'meilisearch';
import { SearchResult, SearchOptions, IndexConfig, DocumentToIndex, IndexStats } from '../common/types/search.types';
import { DEFAULT_INDEX_CONFIGS } from './search.config';

@Injectable()
export class SearchService implements OnModuleInit {
  private readonly logger = new Logger(SearchService.name);
  private client: MeiliSearch;
  private indexes: Map<string, Index> = new Map();

  constructor(private configService: ConfigService) {
    this.client = new MeiliSearch({
      host: this.configService.get<string>('search.host', ''),
      apiKey: this.configService.get<string>('search.apiKey', ''),
      timeout: this.configService.get<number>('search.timeout', 3000),
    });
  }

  async onModuleInit() {
    try {
      await this.initializeIndexes();
      this.logger.log('Search service initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize search service', error);
    }
  }

  private async initializeIndexes() {
    for (const config of Object.values(DEFAULT_INDEX_CONFIGS)) {
      try {
        await this.createIndex(config);
        this.logger.log(`Index '${config.name}' initialized`);
      } catch (error: any) {
        if (error instanceof MeiliSearchError) {
          this.logger.log(`Index '${config.name}' already exists`);
          this.indexes.set(config.name, this.client.index(config.name));
        } else {
          this.logger.error(`Failed to initialize index '${config.name}'`, error);
        }
      }
    }
  }

  async createIndex(config: IndexConfig): Promise<Index> {
    try {
      await this.client.createIndex(config.name, { primaryKey: config.primaryKey });
      const index = this.client.index(config.name);
      await this.configureIndex(index, config);
      this.indexes.set(config.name, index);
      return index;
    } catch (error: any) {
      this.logger.error(`Failed to create index '${config.name}'`, error);
      throw error;
    }
  }

  private async configureIndex(index: Index, config: IndexConfig) {
    try {
      if (config.searchableAttributes) await index.updateSearchableAttributes(config.searchableAttributes);
      if (config.filterableAttributes) await index.updateFilterableAttributes(config.filterableAttributes);
      if (config.sortableAttributes) await index.updateSortableAttributes(config.sortableAttributes);
      if (config.rankingRules) await index.updateRankingRules(config.rankingRules);
      if (config.distinctAttribute) await index.updateDistinctAttribute(config.distinctAttribute);
      if (config.stopWords) await index.updateStopWords(config.stopWords);
      if (config.synonyms) await index.updateSynonyms(config.synonyms);
    } catch (error) {
      this.logger.error(`Failed to configure index '${config.name}'`, error);
      throw error;
    }
  }

  async addDocuments(indexName: string, documents: DocumentToIndex[]): Promise<void> {
    try {
      const index = this.indexes.get(indexName) || this.client.index(indexName);
      await index.addDocuments(documents);
      this.logger.log(`Added ${documents.length} documents to index '${indexName}'`);
    } catch (error) {
      this.logger.error(`Failed to add documents to index '${indexName}'`, error);
      throw error;
    }
  }

  async updateDocuments(indexName: string, documents: DocumentToIndex[]): Promise<void> {
    try {
      const index = this.indexes.get(indexName) || this.client.index(indexName);
      await index.updateDocuments(documents);
      this.logger.log(`Updated ${documents.length} documents in index '${indexName}'`);
    } catch (error) {
      this.logger.error(`Failed to update documents in index '${indexName}'`, error);
      throw error;
    }
  }

  async deleteDocuments(indexName: string, documentIds: string[]): Promise<void> {
    try {
      const index = this.indexes.get(indexName) || this.client.index(indexName);
      await index.deleteDocuments(documentIds);
      this.logger.log(`Deleted ${documentIds.length} documents from index '${indexName}'`);
    } catch (error) {
      this.logger.error(`Failed to delete documents from index '${indexName}'`, error);
      throw error;
    }
  }

  async deleteAllDocuments(indexName: string): Promise<void> {
    try {
      const index = this.indexes.get(indexName) || this.client.index(indexName);
      await index.deleteAllDocuments();
      this.logger.log(`Deleted all documents from index '${indexName}'`);
    } catch (error) {
      this.logger.error(`Failed to delete all documents from index '${indexName}'`, error);
      throw error;
    }
  }

  async search<T = any>(indexName: string, query: string, options: SearchOptions = {}): Promise<SearchResult<T>> {
    try {
      const index = this.indexes.get(indexName) || this.client.index(indexName);

      const searchParams = {
        q: query,
        limit: options.limit || 20,
        offset: options.offset || 0,
        filter: options.filter,
        sort: options.sort,
        attributesToRetrieve: options.attributesToRetrieve,
        attributesToHighlight: options.attributesToHighlight,
        attributesToCrop: options.attributesToCrop,
        cropLength: options.cropLength,
        highlightPreTag: options.highlightPreTag || '<mark>',
        highlightPostTag: options.highlightPostTag || '</mark>',
      };

      const result = await index.search(query, searchParams);

      return {
        query,
        hits: result.hits as T[],
        estimatedTotalHits: result.estimatedTotalHits,
        processingTimeMs: result.processingTimeMs,
        limit: searchParams.limit,
        offset: searchParams.offset,
      };
    } catch (error) {
      this.logger.error(`Search failed for index '${indexName}'`, error);
      throw error;
    }
  }

  async getIndexStats(indexName: string): Promise<IndexStats> {
    try {
      const index = this.indexes.get(indexName) || this.client.index(indexName);
      const { numberOfDocuments, isIndexing, fieldDistribution } = await index.getStats();
      return { numberOfDocuments, isIndexing, fieldDistribution };
    } catch (error) {
      this.logger.error(`Failed to get stats for index '${indexName}'`, error);
      throw error;
    }
  }

  async deleteIndex(indexName: string): Promise<void> {
    try {
      await this.client.deleteIndex(indexName);
      this.indexes.delete(indexName);
      this.logger.log(`Index '${indexName}' deleted successfully`);
    } catch (error) {
      this.logger.error(`Failed to delete index '${indexName}'`, error);
      throw error;
    }
  }

  async reindex(indexName: string, documents: DocumentToIndex[]): Promise<void> {
    try {
      const index = this.indexes.get(indexName) || this.client.index(indexName);
      await index.deleteAllDocuments();
      await index.addDocuments(documents);
      this.logger.log(`Reindexed ${documents.length} documents for index '${indexName}'`);
    } catch (error) {
      this.logger.error(`Failed to reindex '${indexName}'`, error);
      throw error;
    }
  }

  getIndex(indexName: string): Index {
    return this.indexes.get(indexName) || this.client.index(indexName);
  }

  async listIndexes(): Promise<IndexesResults<Array<Index>>> {
    try {
      const indexes = await this.client.getIndexes();
      return indexes;
    } catch (error) {
      this.logger.error('Failed to list indexes', error);
      throw error;
    }
  }
}
