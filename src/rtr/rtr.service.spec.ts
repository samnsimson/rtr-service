import { Test, TestingModule } from '@nestjs/testing';
import { RTRService } from './rtr.service';

describe('RTRService', () => {
  let service: RTRService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RTRService],
    }).compile();

    service = module.get<RTRService>(RTRService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
