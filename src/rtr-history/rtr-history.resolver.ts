import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RTRHistoryService } from './rtr-history.service';
import { CreateRTRHistoryInput, RTRHistoryResponse } from './dto';

@Resolver(() => RTRHistoryResponse)
export class RTRHistoryResolver {
  constructor(private readonly rtrHistoryService: RTRHistoryService) {}

  @Mutation(() => RTRHistoryResponse)
  createRTRHistory(@Args('createRTRHistoryInput') createRTRHistoryInput: CreateRTRHistoryInput) {
    return this.rtrHistoryService.create(createRTRHistoryInput);
  }

  @Query(() => [RTRHistoryResponse], { name: 'rtrHistories' })
  findAll() {
    return this.rtrHistoryService.findAll();
  }

  @Query(() => RTRHistoryResponse, { name: 'rtrHistory' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.rtrHistoryService.findOne(id);
  }

  @Mutation(() => RTRHistoryResponse)
  updateRTRHistory(@Args('id', { type: () => Int }) id: number, @Args('updateRTRHistoryInput') updateRTRHistoryInput: CreateRTRHistoryInput) {
    return this.rtrHistoryService.update(id, updateRTRHistoryInput);
  }

  @Mutation(() => RTRHistoryResponse)
  removeRTRHistory(@Args('id', { type: () => Int }) id: number) {
    return this.rtrHistoryService.remove(id);
  }
}
