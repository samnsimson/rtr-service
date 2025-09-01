import { Test, TestingModule } from '@nestjs/testing';
import { JobApplicationsResolver } from './job-applications.resolver';
import { JobApplicationsService } from './job-applications.service';

describe('JobApplicationsResolver', () => {
  let resolver: JobApplicationsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobApplicationsResolver, JobApplicationsService],
    }).compile();

    resolver = module.get<JobApplicationsResolver>(JobApplicationsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
