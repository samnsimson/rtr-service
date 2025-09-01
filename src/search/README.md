# Search Module Documentation

This module provides comprehensive search functionality using Meilisearch, including indexing, searching, and managing search collections.

## Features

- **Full-text search** with typo tolerance and ranking
- **Index management** (create, configure, delete)
- **Document indexing** (add, update, remove)
- **Advanced filtering** and sorting
- **Search result highlighting**
- **Batch processing** for large datasets
- **Entity-specific search services** (jobs, users, profiles)

## Prerequisites

1. **Install Meilisearch**:

   ```bash
   # Using Docker
   docker run -p 7700:7700 getmeili/meilisearch:latest

   # Or download from https://docs.meilisearch.com/learn/getting_started/installation.html
   ```

2. **Environment Variables**:
   ```env
   MEILISEARCH_HOST=http://localhost:7700
   MEILISEARCH_API_KEY=your_master_key_here
   MEILISEARCH_TIMEOUT=10000
   ```

## Quick Start

### 1. Basic Search

```typescript
// Search for jobs
const results = await searchService.search('jobs', 'software engineer', {
  limit: 20,
  filter: 'workType = "REMOTE"',
  sort: ['createdAt:desc'],
});
```

### 2. Index Management

```typescript
// Create a new index
await searchService.createIndex({
  name: 'custom_index',
  primaryKey: 'id',
  searchableAttributes: ['title', 'content'],
  filterableAttributes: ['category', 'status'],
  sortableAttributes: ['createdAt', 'updatedAt'],
});
```

### 3. Document Indexing

```typescript
// Add documents to an index
await searchService.addDocuments('jobs', [
  { id: '1', title: 'Software Engineer', company: 'Tech Corp' },
  { id: '2', title: 'Product Manager', company: 'Startup Inc' },
]);
```

## Services

### SearchService

Core service for managing Meilisearch indexes and performing searches.

**Key Methods:**

- `createIndex(config)` - Create and configure new indexes
- `search(indexName, query, options)` - Perform searches with filters and options
- `addDocuments(indexName, documents)` - Add documents to an index
- `updateDocuments(indexName, documents)` - Update existing documents
- `deleteDocuments(indexName, documentIds)` - Remove documents from an index
- `reindex(indexName, documents)` - Rebuild an index with new documents

### IndexingService

Specialized service for indexing application entities.

**Key Methods:**

- `indexJobs(batchSize)` - Index all jobs from the database
- `indexUsers(batchSize)` - Index all users from the database
- `indexCandidateProfiles(batchSize)` - Index candidate profiles
- `indexRecruiterProfiles(batchSize)` - Index recruiter profiles
- `reindexAll(batchSize)` - Reindex all entities
- `indexSingleJob(jobId)` - Index a single job
- `updateJobInIndex(jobId)` - Update a job in the index

### JobSearchService

Specialized service for job-specific search operations.

**Key Methods:**

- `searchJobs(query, filters, options)` - Search jobs with advanced filters
- `searchJobsByLocation(location, options)` - Search jobs by location
- `searchJobsByWorkType(workType, options)` - Search jobs by work type
- `searchJobsBySalaryRange(minSalary, maxSalary, options)` - Search by salary range
- `getRecentJobs(limit)` - Get recently posted jobs
- `getActiveJobs(options)` - Get active job postings
- `getExpiringJobs(daysUntilExpiry, options)` - Get jobs expiring soon

## GraphQL API

### Search Queries

```graphql
# Basic search
query SearchJobs($query: String!, $filters: JobSearchFiltersInput) {
  searchJobs(query: $query, filters: $filters) {
    hits {
      id
      title
      company
      description
      _formatted {
        title
        description
      }
    }
    estimatedTotalHits
    processingTimeMs
  }
}

# Search by location
query SearchByLocation($location: String!) {
  searchJobsByLocation(location: $location) {
    hits {
      id
      title
      company
      location
    }
  }
}

# Get recent jobs
query GetRecentJobs($limit: Int) {
  getRecentJobs(limit: $limit) {
    id
    title
    company
    createdAt
  }
}
```

### Indexing Mutations

```graphql
# Index all jobs
mutation IndexJobs($batchSize: Int) {
  indexJobs(batchSize: $batchSize)
}

# Reindex everything
mutation ReindexAll($batchSize: Int) {
  reindexAll(batchSize: $batchSize)
}

# Index a single job
mutation IndexSingleJob($jobId: String!) {
  indexSingleJob(jobId: $jobId)
}
```

### Index Management

```graphql
# Create custom index
mutation CreateIndex($config: IndexConfigInput!) {
  createIndex(config: $config)
}

# Add documents
mutation AddDocuments($indexName: String!, $documents: [DocumentToIndexInput!]!) {
  addDocuments(indexName: $indexName, documents: $documents)
}

# Get index stats
query GetIndexStats($indexName: String!) {
  getIndexStats(indexName: $indexName) {
    numberOfDocuments
    isIndexing
    fieldDistribution
  }
}
```

## Configuration

### Default Index Configurations

The module comes with pre-configured indexes for common entities:

**Jobs Index:**

- Searchable: title, company, description, requirements, location, benefits
- Filterable: workType, jobType, compensation, location, status, recruiterId
- Sortable: createdAt, updatedAt, salaryMin, salaryMax

**Users Index:**

- Searchable: name, email
- Filterable: role
- Sortable: createdAt, updatedAt

**Candidate Profiles Index:**

- Searchable: title, bio, skills, experience, education
- Filterable: remotePreference, location, experienceLevel
- Sortable: createdAt, updatedAt

**Recruiter Profiles Index:**

- Searchable: companyName, bio, industry
- Filterable: companySize, location
- Sortable: createdAt, updatedAt

### Custom Index Configuration

```typescript
const customConfig: IndexConfig = {
  name: 'custom_index',
  primaryKey: 'id',
  searchableAttributes: ['title', 'content', 'tags'],
  filterableAttributes: ['category', 'status', 'author'],
  sortableAttributes: ['createdAt', 'updatedAt', 'rating'],
  rankingRules: ['words', 'typo', 'proximity', 'attribute', 'sort', 'exactness'],
  distinctAttribute: 'author',
  stopWords: ['the', 'a', 'an'],
  synonyms: {
    developer: ['programmer', 'coder'],
    engineer: ['developer', 'programmer'],
  },
};
```

## Search Options

### Basic Options

```typescript
const searchOptions: SearchOptions = {
  limit: 20, // Number of results to return
  offset: 0, // Pagination offset
  filter: 'status = "ACTIVE"', // Filter string
  sort: ['createdAt:desc'], // Sort criteria
};
```

### Advanced Options

```typescript
const advancedOptions: SearchOptions = {
  limit: 20,
  offset: 0,
  filter: 'workType = "REMOTE" AND salaryMin >= 50000',
  sort: ['salaryMax:desc'],
  attributesToRetrieve: ['id', 'title', 'company', 'salary'],
  attributesToHighlight: ['title', 'description'],
  attributesToCrop: ['description'],
  cropLength: 150,
  highlightPreTag: '<mark>',
  highlightPostTag: '</mark>',
};
```

## Filtering

### Filter Syntax

Meilisearch uses a simple but powerful filter syntax:

```typescript
// Simple equality
'status = "ACTIVE"';

// Multiple conditions
'workType = "REMOTE" AND salaryMin >= 50000';

// Array membership
'workType IN ["REMOTE", "HYBRID"]';

// Range filters
'salaryMin >= 50000 AND salaryMax <= 100000';

// Complex filters
'(workType = "REMOTE" OR workType = "HYBRID") AND status = "ACTIVE"';
```

### Common Filter Examples

```typescript
// Jobs in specific location
'location = "San Francisco"';

// Jobs with salary range
'salaryMin >= 80000 AND salaryMax <= 120000';

// Active remote jobs
'status = "ACTIVE" AND workType = "REMOTE"';

// Jobs by specific recruiter
'recruiterId = "recruiter-uuid"';

// Jobs expiring soon
'expiresAt <= "2024-02-01T00:00:00Z"';
```

## Integration with Existing Modules

### Automatic Indexing

The search module can be integrated with existing services to automatically maintain search indexes:

```typescript
// In JobsService
async create(createJobInput: CreateJobInput, user: CurrentUser): Promise<JobResponse> {
  const job = await this.jobsRepo.save(createJobInput);

  // Index the new job
  await this.indexingService.indexSingleJob(job.id);

  return this.toResponse(job);
}

async update(id: string, updateJobInput: UpdateJobInput): Promise<JobResponse> {
  const job = await this.jobsRepo.save({ id, ...updateJobInput });

  // Update the job in search index
  await this.indexingService.updateJobInIndex(id);

  return this.toResponse(job);
}

async remove(id: string): Promise<JobResponse> {
  const job = await this.jobsRepo.findOne({ where: { id } });
  await this.jobsRepo.remove(job);

  // Remove from search index
  await this.indexingService.removeJobFromIndex(id);

  return this.toResponse(job);
}
```

### Search in Resolvers

```typescript
// In JobsResolver
@Query(() => [JobResponse], { name: 'searchJobs' })
async searchJobs(
  @Args('query') query: string,
  @Args('filters') filters: JobSearchFilters
): Promise<JobResponse[]> {
  const searchResults = await this.jobSearchService.searchJobs(query, filters);
  return searchResults.hits.map(job => this.toResponse(job));
}
```

## Performance Considerations

### Batch Processing

For large datasets, use batch processing:

```typescript
// Process in batches of 100
await this.indexingService.indexJobs(100);
await this.indexingService.indexUsers(100);
```

### Index Optimization

- Use appropriate `searchableAttributes` to limit search scope
- Set `filterableAttributes` for frequently used filters
- Configure `sortableAttributes` for common sorting needs
- Use `rankingRules` to customize result relevance

### Caching

Consider implementing caching for frequently searched queries:

```typescript
// Example with Redis caching
async searchJobsWithCache(query: string, filters: JobSearchFilters): Promise<SearchResult> {
  const cacheKey = `search:${query}:${JSON.stringify(filters)}`;

  // Try to get from cache first
  const cached = await this.redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // Perform search
  const result = await this.searchJobs(query, filters);

  // Cache for 5 minutes
  await this.redis.setex(cacheKey, 300, JSON.stringify(result));

  return result;
}
```

## Error Handling

The module includes comprehensive error handling:

```typescript
try {
  const results = await this.searchService.search('jobs', 'engineer');
  return results;
} catch (error) {
  if (error instanceof MeiliSearchError) {
    this.logger.error(`Search error: ${error.message}`, error);
    throw new BadRequestException('Search operation failed');
  }
  throw error;
}
```

## Monitoring and Logging

The module provides detailed logging for monitoring:

```typescript
// Log levels
this.logger.log('Search operation completed successfully');
this.logger.warn('Search returned fewer results than expected');
this.logger.error('Search operation failed', error);
```

## Testing

### Unit Tests

```typescript
describe('SearchService', () => {
  let service: SearchService;
  let mockMeiliSearch: jest.Mocked<MeiliSearch>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'search.host':
                  return 'http://localhost:7700';
                case 'search.apiKey':
                  return 'test-key';
                case 'search.timeout':
                  return 5000;
                default:
                  return undefined;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
  });

  it('should search successfully', async () => {
    const result = await service.search('jobs', 'engineer');
    expect(result.hits).toBeDefined();
  });
});
```

### Integration Tests

```typescript
describe('Search Integration', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [SearchModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should create and search index', async () => {
    // Test index creation and search
  });
});
```

## Troubleshooting

### Common Issues

1. **Connection Errors**: Check Meilisearch host and port
2. **Authentication Errors**: Verify API key configuration
3. **Index Not Found**: Ensure index exists before searching
4. **Filter Errors**: Check filter syntax and attribute names

### Debug Mode

Enable debug logging:

```typescript
// In your environment
NODE_ENV = development;
LOG_LEVEL = debug;
```

### Health Checks

```typescript
// Check Meilisearch health
const health = await this.client.health();
console.log('Meilisearch status:', health.status);
```

## Best Practices

1. **Index Design**: Plan your index structure carefully
2. **Batch Operations**: Use batch processing for large datasets
3. **Error Handling**: Implement proper error handling and fallbacks
4. **Monitoring**: Monitor search performance and errors
5. **Caching**: Cache frequently searched queries
6. **Testing**: Test search functionality thoroughly
7. **Documentation**: Keep search documentation up to date

## Support

For Meilisearch-specific issues, refer to the [official documentation](https://docs.meilisearch.com/).

For module-specific issues, check the logs and ensure proper configuration.
