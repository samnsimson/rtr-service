import { CreateRTRInput } from './create-rtr.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRTRInput extends PartialType(CreateRTRInput) {
  @Field(() => Int)
  id: number;
}
