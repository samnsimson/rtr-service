import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RTRHistoryService } from './rtr-history.service';
import { RTRHistory } from './entities/rtr-history.entity';
import { CreateRTRHistoryInput } from './dto/create-rtr-history.input';
import { UpdateRTRHistoryInput } from './dto/update-rtr-history.input';

@Resolver(() => RTRHistory)
export class RTRHistoryResolver {
  constructor(private readonly rtrHistoryService: RTRHistoryService) {}

  @Mutation(() => RTRHistory)
  createRTRHistory(@Args('createRTRHistoryInput') createRTRHistoryInput: CreateRTRHistoryInput) {
    return this.rtrHistoryService.create(createRTRHistoryInput);
  }

  @Query(() => [RTRHistory], { name: 'rtrHistory' })
  findAll() {
    return this.rtrHistoryService.findAll();
  }

  @Query(() => RTRHistory, { name: 'rtrHistory' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.rtrHistoryService.findOne(id);
  }

  @Mutation(() => RTRHistory)
  updateRTRHistory(@Args('updateRTRHistoryInput') updateRTRHistoryInput: UpdateRTRHistoryInput) {
    return this.rtrHistoryService.update(updateRTRHistoryInput.id, updateRTRHistoryInput);
  }

  @Mutation(() => RTRHistory)
  removeRTRHistory(@Args('id', { type: () => Int }) id: number) {
    return this.rtrHistoryService.remove(id);
  }
}
