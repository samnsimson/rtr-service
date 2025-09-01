import { Test, TestingModule } from '@nestjs/testing';
import { RtrHistoryResolver } from './rtr-history.resolver';
import { RtrHistoryService } from './rtr-history.service';

describe('RtrHistoryResolver', () => {
  let resolver: RtrHistoryResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RtrHistoryResolver, RtrHistoryService],
    }).compile();

    resolver = module.get<RtrHistoryResolver>(RtrHistoryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
