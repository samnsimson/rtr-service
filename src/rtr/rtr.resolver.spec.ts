import { Test, TestingModule } from '@nestjs/testing';
import { RtrResolver } from './rtr.resolver';
import { RtrService } from './rtr.service';

describe('RtrResolver', () => {
  let resolver: RtrResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RtrResolver, RtrService],
    }).compile();

    resolver = module.get<RtrResolver>(RtrResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
