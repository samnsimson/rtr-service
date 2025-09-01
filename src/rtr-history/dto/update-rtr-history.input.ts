import { CreateRTRHistoryInput } from './create-rtr-history.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRTRHistoryInput extends PartialType(CreateRTRHistoryInput) {
  @Field(() => Int)
  id: number;
}
