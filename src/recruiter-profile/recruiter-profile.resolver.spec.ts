import { Test, TestingModule } from '@nestjs/testing';
import { RecruiterProfileResolver } from './recruiter-profile.resolver';
import { RecruiterProfileService } from './recruiter-profile.service';

describe('RecruiterProfileResolver', () => {
  let resolver: RecruiterProfileResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecruiterProfileResolver, RecruiterProfileService],
    }).compile();

    resolver = module.get<RecruiterProfileResolver>(RecruiterProfileResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
