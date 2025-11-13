import { Injectable } from '@nestjs/common';
import { CreateCandidateListInput } from './dto/create-candidate-list.input';
import { UpdateCandidateListInput } from './dto/update-candidate-list.input';

@Injectable()
export class CandidateListsService {
  create(createCandidateListInput: CreateCandidateListInput) {
    return 'This action adds a new organizationCandidate';
  }

  findAll() {
    return `This action returns all organizationCandidates`;
  }

  findOne(id: number) {
    return `This action returns a #${id} organizationCandidate`;
  }

  update(id: number, updateCandidateListInput: UpdateCandidateListInput) {
    return `This action updates a #${id} organizationCandidate`;
  }

  remove(id: number) {
    return `This action removes a #${id} organizationCandidate`;
  }
}
