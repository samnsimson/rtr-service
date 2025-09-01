import { CreateRtrInput } from './create-rtr.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRtrInput extends PartialType(CreateRtrInput) {
  @Field(() => Int)
  id: number;
}
