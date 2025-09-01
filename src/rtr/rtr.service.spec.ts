import { Test, TestingModule } from '@nestjs/testing';
import { RtrService } from './rtr.service';

describe('RtrService', () => {
  let service: RtrService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RtrService],
    }).compile();

    service = module.get<RtrService>(RtrService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
