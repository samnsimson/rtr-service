export interface SearchResult<T = any> {
  hits: T[];
  estimatedTotalHits: number;
  processingTimeMs: number;
  query: string;
  limit: number;
  offset: number;
}

export interface SearchOptions {
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

export interface IndexConfig {
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

export interface DocumentToIndex {
  id: string;
  [key: string]: any;
}

export interface IndexStats {
  numberOfDocuments: number;
  isIndexing: boolean;
  fieldDistribution: Record<string, number>;
}
