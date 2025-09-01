import { Injectable } from '@nestjs/common';
import { CreateJobInput, UpdateJobInput } from './dto';

@Injectable()
export class JobsService {
  create(createJobInput: CreateJobInput) {
    return 'This action adds a new job';
  }

  findAll() {
    return `This action returns all jobs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} job`;
  }

  update(id: number, updateJobInput: UpdateJobInput) {
    return `This action updates a #${id} job`;
  }

  remove(id: number) {
    return `This action removes a #${id} job`;
  }
}
