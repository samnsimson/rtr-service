import { Test, TestingModule } from '@nestjs/testing';
import { CandidateProfileResolver } from './candidate-profile.resolver';
import { CandidateProfileService } from './candidate-profile.service';

describe('CandidateProfileResolver', () => {
  let resolver: CandidateProfileResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CandidateProfileResolver, CandidateProfileService],
    }).compile();

    resolver = module.get<CandidateProfileResolver>(CandidateProfileResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
