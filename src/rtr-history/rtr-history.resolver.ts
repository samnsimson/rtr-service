import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RTRHistoryService } from './rtr-history.service';
import { RTRHistory } from './entities/rtr-history.entity';
import { CreateRTRHistoryInput } from './dto';

@Resolver(() => RTRHistory)
export class RTRHistoryResolver {
  constructor(private readonly rtrHistoryService: RTRHistoryService) {}

  @Mutation(() => RTRHistory)
  createRTRHistory(@Args('createRTRHistoryInput') createRTRHistoryInput: CreateRTRHistoryInput) {
    return this.rtrHistoryService.create(createRTRHistoryInput);
  }

  @Query(() => [RTRHistory], { name: 'rtrHistories' })
  findAll() {
    return this.rtrHistoryService.findAll();
  }

  @Query(() => RTRHistory, { name: 'rtrHistory' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.rtrHistoryService.findOne(id);
  }

  @Mutation(() => RTRHistory)
  updateRTRHistory(@Args('id', { type: () => Int }) id: number, @Args('updateRTRHistoryInput') updateRTRHistoryInput: CreateRTRHistoryInput) {
    return this.rtrHistoryService.update(id, updateRTRHistoryInput);
  }

  @Mutation(() => RTRHistory)
  removeRTRHistory(@Args('id', { type: () => Int }) id: number) {
    return this.rtrHistoryService.remove(id);
  }
}
