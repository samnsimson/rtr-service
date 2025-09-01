import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RTRService } from './rtr.service';
import { RTR } from './entities/rtr.entity';
import { CreateRTRInput, UpdateRTRInput } from './dto';

@Resolver(() => RTR)
export class RTRResolver {
  constructor(private readonly rtrService: RTRService) {}

  @Mutation(() => RTR)
  createRTR(@Args('createRTRInput') createRTRInput: CreateRTRInput) {
    return this.rtrService.create(createRTRInput);
  }

  @Query(() => [RTR], { name: 'rtrs' })
  findAll() {
    return this.rtrService.findAll();
  }

  @Query(() => RTR, { name: 'rtr' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.rtrService.findOne(id);
  }

  @Mutation(() => RTR)
  updateRTR(@Args('id', { type: () => Int }) id: number, @Args('updateRTRInput') updateRTRInput: UpdateRTRInput) {
    return this.rtrService.update(id, updateRTRInput);
  }

  @Mutation(() => RTR)
  removeRTR(@Args('id', { type: () => Int }) id: number) {
    return this.rtrService.remove(id);
  }
}
