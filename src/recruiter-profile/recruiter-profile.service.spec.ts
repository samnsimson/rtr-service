import { Test, TestingModule } from '@nestjs/testing';
import { RecruiterProfileService } from './recruiter-profile.service';

describe('RecruiterProfileService', () => {
  let service: RecruiterProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecruiterProfileService],
    }).compile();

    service = module.get<RecruiterProfileService>(RecruiterProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
