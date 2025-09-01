import { Injectable } from '@nestjs/common';
import { CreateRtrInput } from './dto/create-rtr.input';
import { UpdateRtrInput } from './dto/update-rtr.input';

@Injectable()
export class RtrService {
  create(createRtrInput: CreateRtrInput) {
    return 'This action adds a new rtr';
  }

  findAll() {
    return `This action returns all rtr`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rtr`;
  }

  update(id: number, updateRtrInput: UpdateRtrInput) {
    return `This action updates a #${id} rtr`;
  }

  remove(id: number) {
    return `This action removes a #${id} rtr`;
  }
}
