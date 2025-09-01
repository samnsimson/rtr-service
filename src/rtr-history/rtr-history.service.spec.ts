import { Test, TestingModule } from '@nestjs/testing';
import { RTRHistoryService } from './rtr-history.service';

describe('RTRHistoryService', () => {
  let service: RTRHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RTRHistoryService],
    }).compile();

    service = module.get<RTRHistoryService>(RTRHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
