import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EmployerListService } from './employer-list.service';
import { EmployerList } from './entities/employer-list.entity';
import { CreateEmployerListInput } from './dto/create-employer-list.input';
import { UpdateEmployerListInput } from './dto/update-employer-list.input';

@Resolver(() => EmployerList)
export class EmployerListResolver {
  constructor(private readonly employerListService: EmployerListService) {}

  @Mutation(() => EmployerList)
  createEmployerList(@Args('createEmployerListInput') createEmployerListInput: CreateEmployerListInput) {
    return this.employerListService.create(createEmployerListInput);
  }

  @Query(() => [EmployerList], { name: 'employerList' })
  findAll() {
    return this.employerListService.findAll();
  }

  @Query(() => EmployerList, { name: 'employerList' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.employerListService.findOne(id);
  }

  @Mutation(() => EmployerList)
  updateEmployerList(@Args('updateEmployerListInput') updateEmployerListInput: UpdateEmployerListInput) {
    return this.employerListService.update(updateEmployerListInput.id, updateEmployerListInput);
  }

  @Mutation(() => EmployerList)
  removeEmployerList(@Args('id', { type: () => Int }) id: number) {
    return this.employerListService.remove(id);
  }
}
