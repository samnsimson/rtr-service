import { Injectable } from '@nestjs/common';
import { CreateJobApplicationInput, UpdateJobApplicationInput } from './dto';

@Injectable()
export class JobApplicationsService {
  create(createJobApplicationInput: CreateJobApplicationInput) {
    return 'This action adds a new jobApplication';
  }

  findAll() {
    return `This action returns all jobApplications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jobApplication`;
  }

  update(id: number, updateJobApplicationInput: UpdateJobApplicationInput) {
    return `This action updates a #${id} jobApplication`;
  }

  remove(id: number) {
    return `This action removes a #${id} jobApplication`;
  }
}
