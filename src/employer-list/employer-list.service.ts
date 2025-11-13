import { Injectable } from '@nestjs/common';
import { CreateEmployerListInput } from './dto/create-employer-list.input';
import { UpdateEmployerListInput } from './dto/update-employer-list.input';

@Injectable()
export class EmployerListService {
  create(createEmployerListInput: CreateEmployerListInput) {
    return 'This action adds a new employerList';
  }

  findAll() {
    return `This action returns all employerList`;
  }

  findOne(id: number) {
    return `This action returns a #${id} employerList`;
  }

  update(id: number, updateEmployerListInput: UpdateEmployerListInput) {
    return `This action updates a #${id} employerList`;
  }

  remove(id: number) {
    return `This action removes a #${id} employerList`;
  }
}
