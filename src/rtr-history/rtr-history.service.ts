import { Injectable } from '@nestjs/common';
import { CreateRtrHistoryInput } from './dto/create-rtr-history.input';
import { UpdateRtrHistoryInput } from './dto/update-rtr-history.input';

@Injectable()
export class RtrHistoryService {
  create(createRtrHistoryInput: CreateRtrHistoryInput) {
    return 'This action adds a new rtrHistory';
  }

  findAll() {
    return `This action returns all rtrHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rtrHistory`;
  }

  update(id: number, updateRtrHistoryInput: UpdateRtrHistoryInput) {
    return `This action updates a #${id} rtrHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} rtrHistory`;
  }
}
