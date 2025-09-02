export const DEFAULT_INDEX_CONFIGS = {
  jobs: {
    name: 'jobs',
    primaryKey: 'id',
    searchableAttributes: ['title', 'company', 'description', 'requirements', 'location', 'benefits'],
    filterableAttributes: ['workType', 'jobType', 'compensation', 'location', 'status', 'recruiterId'],
    sortableAttributes: ['createdAt', 'updatedAt', 'salaryMin', 'salaryMax'],
    rankingRules: ['words', 'typo', 'proximity', 'attribute', 'sort', 'exactness'],
  },
  users: {
    name: 'users',
    primaryKey: 'id',
    searchableAttributes: ['name', 'email'],
    filterableAttributes: ['role'],
    sortableAttributes: ['createdAt', 'updatedAt'],
  },
  candidateProfiles: {
    name: 'candidate_profiles',
    primaryKey: 'id',
    searchableAttributes: ['title', 'bio', 'skills', 'experience', 'education'],
    filterableAttributes: ['remotePreference', 'location', 'experienceLevel'],
    sortableAttributes: ['createdAt', 'updatedAt'],
  },
  recruiterProfiles: {
    name: 'recruiter_profiles',
    primaryKey: 'id',
    searchableAttributes: ['companyName', 'bio', 'industry'],
    filterableAttributes: ['companySize', 'location'],
    sortableAttributes: ['createdAt', 'updatedAt'],
  },
};
