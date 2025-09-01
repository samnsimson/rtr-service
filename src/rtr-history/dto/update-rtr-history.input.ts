import { CreateRtrHistoryInput } from './create-rtr-history.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRtrHistoryInput extends PartialType(CreateRtrHistoryInput) {
  @Field(() => Int)
  id: number;
}
