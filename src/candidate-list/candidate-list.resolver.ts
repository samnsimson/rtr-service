import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CandidateListsService } from './candidate-list.service';
import { CandidateList } from './entities/candidate-list.entity';
import { CreateCandidateListInput } from './dto/create-candidate-list.input';
import { UpdateCandidateListInput } from './dto/update-candidate-list.input';

@Resolver(() => CandidateList)
export class CandidateListsResolver {
  constructor(private readonly organizationCandidatesService: CandidateListsService) {}

  @Mutation(() => CandidateList)
  createCandidateList(@Args('createCandidateListInput') createCandidateListInput: CreateCandidateListInput) {
    return this.organizationCandidatesService.create(createCandidateListInput);
  }

  @Query(() => [CandidateList], { name: 'organizationCandidates' })
  findAll() {
    return this.organizationCandidatesService.findAll();
  }

  @Query(() => CandidateList, { name: 'organizationCandidate' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.organizationCandidatesService.findOne(id);
  }

  @Mutation(() => CandidateList)
  updateCandidateList(@Args('updateCandidateListInput') updateCandidateListInput: UpdateCandidateListInput) {
    return this.organizationCandidatesService.update(updateCandidateListInput.id, updateCandidateListInput);
  }

  @Mutation(() => CandidateList)
  removeCandidateList(@Args('id', { type: () => Int }) id: number) {
    return this.organizationCandidatesService.remove(id);
  }
}
