import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RTRService } from './rtr.service';
import { CreateRTRInput, RtrResponse, UpdateRTRInput } from './dto';

@Resolver(() => RtrResponse)
export class RTRResolver {
  constructor(private readonly rtrService: RTRService) {}

  @Mutation(() => RtrResponse)
  createRTR(@Args('createRTRInput') createRTRInput: CreateRTRInput) {
    return this.rtrService.create(createRTRInput);
  }

  @Query(() => [RtrResponse], { name: 'rtrs' })
  findAll() {
    return this.rtrService.findAll();
  }

  @Query(() => RtrResponse, { name: 'rtr' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.rtrService.findOne(id);
  }

  @Mutation(() => RtrResponse)
  updateRTR(@Args('id', { type: () => Int }) id: number, @Args('updateRTRInput') updateRTRInput: UpdateRTRInput) {
    return this.rtrService.update(id, updateRTRInput);
  }

  @Mutation(() => RtrResponse)
  removeRTR(@Args('id', { type: () => Int }) id: number) {
    return this.rtrService.remove(id);
  }
}
