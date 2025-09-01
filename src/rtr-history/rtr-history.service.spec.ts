import { Test, TestingModule } from '@nestjs/testing';
import { RtrHistoryService } from './rtr-history.service';

describe('RtrHistoryService', () => {
  let service: RtrHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RtrHistoryService],
    }).compile();

    service = module.get<RtrHistoryService>(RtrHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
