import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class SearchOptionsInput {
  @Field(() => Int, { nullable: true, description: 'Number of results to return' })
  limit?: number;

  @Field(() => Int, { nullable: true, description: 'Pagination offset' })
  offset?: number;

  @Field(() => [String], { nullable: true, description: 'Filter string or array' })
  filter?: string | string[];

  @Field(() => [String], { nullable: true, description: 'Sort criteria' })
  sort?: string[];

  @Field(() => [String], { nullable: true, description: 'Attributes to retrieve' })
  attributesToRetrieve?: string[];

  @Field(() => [String], { nullable: true, description: 'Attributes to highlight' })
  attributesToHighlight?: string[];

  @Field(() => [String], { nullable: true, description: 'Attributes to crop' })
  attributesToCrop?: string[];

  @Field(() => Int, { nullable: true, description: 'Crop length for text' })
  cropLength?: number;

  @Field(() => String, { nullable: true, description: 'Highlight pre-tag' })
  highlightPreTag?: string;

  @Field(() => String, { nullable: true, description: 'Highlight post-tag' })
  highlightPostTag?: string;
}

@InputType()
export class IndexConfigInput {
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

@InputType()
export class DocumentToIndexInput {
  @Field(() => String, { description: 'Document ID' })
  id: string;
}

@InputType()
export class JobSearchFiltersInput {
  @Field(() => [String], { nullable: true, description: 'Work type filters' })
  workType?: string[];

  @Field(() => [String], { nullable: true, description: 'Job type filters' })
  jobType?: string[];

  @Field(() => [String], { nullable: true, description: 'Compensation type filters' })
  compensation?: string[];

  @Field(() => String, { nullable: true, description: 'Location filter' })
  location?: string;

  @Field(() => String, { nullable: true, description: 'Status filter' })
  status?: string;

  @Field(() => String, { nullable: true, description: 'Recruiter ID filter' })
  recruiterId?: string;

  @Field(() => Int, { nullable: true, description: 'Minimum salary filter' })
  salaryMin?: number;

  @Field(() => Int, { nullable: true, description: 'Maximum salary filter' })
  salaryMax?: number;
}
