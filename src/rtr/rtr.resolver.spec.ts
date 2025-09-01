import { Test, TestingModule } from '@nestjs/testing';
import { RTRResolver } from './rtr.resolver';
import { RTRService } from './rtr.service';

describe('RTRResolver', () => {
  let resolver: RTRResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RTRResolver, RTRService],
    }).compile();

    resolver = module.get<RTRResolver>(RTRResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
