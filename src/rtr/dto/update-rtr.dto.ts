import { PartialType } from '@nestjs/mapped-types';
import { Field, InputType } from '@nestjs/graphql';
import { CreateRtrInput } from './create-rtr.input';

@InputType()
export class UpdateRTRInput extends PartialType(CreateRtrInput) {
  @Field()
  id: string;
}
