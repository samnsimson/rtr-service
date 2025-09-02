import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class SearchResultType<T = any> {
  @Field(() => [String], { description: 'Search result hits' })
  hits: T[];

  @Field(() => Int, { description: 'Estimated total number of hits' })
  estimatedTotalHits: number;

  @Field(() => Int, { description: 'Processing time in milliseconds' })
  processingTimeMs: number;

  @Field(() => String, { description: 'Search query' })
  query: string;

  @Field(() => Int, { description: 'Number of results returned' })
  limit: number;

  @Field(() => Int, { description: 'Pagination offset' })
  offset: number;
}

@ObjectType()
export class IndexConfigType {
  @Field(() => String, { description: 'Index name' })
  name: string;

  @Field(() => String, { nullable: true, description: 'Primary key field' })
  primaryKey?: string;

  @Field(() => [String], { nullable: true, description: 'Searchable attributes' })
  searchableAttributes?: string[];

  @Field(() => [String], { nullable: true, description: 'Filterable attributes' })
  filterableAttributes?: string[];

  @Field(() => [String], { nullable: true, description: 'Sortable attributes' })
  sortableAttributes?: string[];

  @Field(() => [String], { nullable: true, description: 'Ranking rules' })
  rankingRules?: string[];

  @Field(() => String, { nullable: true, description: 'Distinct attribute' })
  distinctAttribute?: string;

  @Field(() => [String], { nullable: true, description: 'Stop words' })
  stopWords?: string[];

  @Field(() => String, { nullable: true, description: 'Synonyms mapping' })
  synonyms?: Record<string, string[]>;
}

@ObjectType()
export class DocumentToIndexType {
  @Field(() => String, { description: 'Document ID' })
  id: string;
}

@ObjectType()
export class IndexStatsType {
  @Field(() => Int, { description: 'Number of documents in index' })
  numberOfDocuments: number;

  @Field(() => Boolean, { description: 'Whether index is currently being built' })
  isIndexing: boolean;

  @Field(() => String, { description: 'Field distribution statistics' })
  fieldDistribution: Record<string, number>;
}

@ObjectType()
export class IndexType {
  @Field(() => String, { description: 'Index name' })
  name: string;

  @Field(() => String, { nullable: true, description: 'Primary key field' })
  primaryKey?: string;

  @Field(() => [String], { nullable: true, description: 'Searchable attributes' })
  searchableAttributes?: string[];

  @Field(() => [String], { nullable: true, description: 'Filterable attributes' })
  filterableAttributes?: string[];

  @Field(() => [String], { nullable: true, description: 'Sortable attributes' })
  sortableAttributes?: string[];
}
