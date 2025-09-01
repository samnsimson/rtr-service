import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RtrService } from './rtr.service';
import { Rtr } from './entities/rtr.entity';
import { CreateRtrInput } from './dto/create-rtr.input';
import { UpdateRtrInput } from './dto/update-rtr.input';

@Resolver(() => Rtr)
export class RtrResolver {
  constructor(private readonly rtrService: RtrService) {}

  @Mutation(() => Rtr)
  createRtr(@Args('createRtrInput') createRtrInput: CreateRtrInput) {
    return this.rtrService.create(createRtrInput);
  }

  @Query(() => [Rtr], { name: 'rtr' })
  findAll() {
    return this.rtrService.findAll();
  }

  @Query(() => Rtr, { name: 'rtr' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.rtrService.findOne(id);
  }

  @Mutation(() => Rtr)
  updateRtr(@Args('updateRtrInput') updateRtrInput: UpdateRtrInput) {
    return this.rtrService.update(updateRtrInput.id, updateRtrInput);
  }

  @Mutation(() => Rtr)
  removeRtr(@Args('id', { type: () => Int }) id: number) {
    return this.rtrService.remove(id);
  }
}
