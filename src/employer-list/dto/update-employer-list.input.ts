import { CreateEmployerListInput } from './create-employer-list.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateEmployerListInput extends PartialType(CreateEmployerListInput) {
  @Field(() => Int)
  id: number;
}
