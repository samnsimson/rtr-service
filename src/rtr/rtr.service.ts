import { Injectable } from '@nestjs/common';
import { CreateRTRInput } from './dto/create-rtr.input';
import { UpdateRTRInput } from './dto/update-rtr.input';

@Injectable()
export class RTRService {
  create(createRTRInput: CreateRTRInput) {
    return 'This action adds a new rtr';
  }

  findAll() {
    return `This action returns all rtr`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rtr`;
  }

  update(id: number, updateRTRInput: UpdateRTRInput) {
    return `This action updates a #${id} rtr`;
  }

  remove(id: number) {
    return `This action removes a #${id} rtr`;
  }
}
