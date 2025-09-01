import { Test, TestingModule } from '@nestjs/testing';
import { RTRHistoryResolver } from './rtr-history.resolver';
import { RTRHistoryService } from './rtr-history.service';

describe('RTRHistoryResolver', () => {
  let resolver: RTRHistoryResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RTRHistoryResolver, RTRHistoryService],
    }).compile();

    resolver = module.get<RTRHistoryResolver>(RTRHistoryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
