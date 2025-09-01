import { Injectable } from '@nestjs/common';
import { CreateRTRHistoryInput } from './dto';

@Injectable()
export class RTRHistoryService {
  create(createRTRHistoryInput: CreateRTRHistoryInput) {
    return 'This action adds a new rtrHistory';
  }

  findAll() {
    return `This action returns all rtrHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rtrHistory`;
  }

  update(id: number, updateRTRHistoryInput: CreateRTRHistoryInput) {
    return `This action updates a #${id} rtrHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} rtrHistory`;
  }
}
