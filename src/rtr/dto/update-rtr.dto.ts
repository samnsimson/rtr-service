import { PartialType } from '@nestjs/mapped-types';
import { Field, InputType } from '@nestjs/graphql';
import { CreateRTRInput } from './create-rtr.dto';

@InputType()
export class UpdateRTRInput extends PartialType(CreateRTRInput) {
  @Field()
  id: string;
}
