import { Injectable } from '@nestjs/common';
import { CreateRTRHistoryInput } from './dto/create-rtr-history.input';
import { UpdateRTRHistoryInput } from './dto/update-rtr-history.input';

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

  update(id: number, updateRTRHistoryInput: UpdateRTRHistoryInput) {
    return `This action updates a #${id} rtrHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} rtrHistory`;
  }
}
