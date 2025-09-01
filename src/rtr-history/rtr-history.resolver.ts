import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RtrHistoryService } from './rtr-history.service';
import { RtrHistory } from './entities/rtr-history.entity';
import { CreateRtrHistoryInput } from './dto/create-rtr-history.input';
import { UpdateRtrHistoryInput } from './dto/update-rtr-history.input';

@Resolver(() => RtrHistory)
export class RtrHistoryResolver {
  constructor(private readonly rtrHistoryService: RtrHistoryService) {}

  @Mutation(() => RtrHistory)
  createRtrHistory(@Args('createRtrHistoryInput') createRtrHistoryInput: CreateRtrHistoryInput) {
    return this.rtrHistoryService.create(createRtrHistoryInput);
  }

  @Query(() => [RtrHistory], { name: 'rtrHistory' })
  findAll() {
    return this.rtrHistoryService.findAll();
  }

  @Query(() => RtrHistory, { name: 'rtrHistory' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.rtrHistoryService.findOne(id);
  }

  @Mutation(() => RtrHistory)
  updateRtrHistory(@Args('updateRtrHistoryInput') updateRtrHistoryInput: UpdateRtrHistoryInput) {
    return this.rtrHistoryService.update(updateRtrHistoryInput.id, updateRtrHistoryInput);
  }

  @Mutation(() => RtrHistory)
  removeRtrHistory(@Args('id', { type: () => Int }) id: number) {
    return this.rtrHistoryService.remove(id);
  }
}
