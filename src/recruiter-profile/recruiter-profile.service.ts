import { Injectable } from '@nestjs/common';
import { CreateRecruiterProfileInput, UpdateRecruiterProfileInput } from './dto';

@Injectable()
export class RecruiterProfileService {
  create(createRecruiterProfileInput: CreateRecruiterProfileInput) {
    return 'This action adds a new recruiterProfile';
  }

  findAll() {
    return `This action returns all recruiterProfile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} recruiterProfile`;
  }

  update(id: number, updateRecruiterProfileInput: UpdateRecruiterProfileInput) {
    return `This action updates a #${id} recruiterProfile`;
  }

  remove(id: number) {
    return `This action removes a #${id} recruiterProfile`;
  }
}
