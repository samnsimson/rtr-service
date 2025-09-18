import { IsUUID } from 'class-validator';
import { CreateRtrTemplateInput } from './create-rtr-template.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRtrTemplateInput extends PartialType(CreateRtrTemplateInput) {
  @Field(() => String)
  @IsUUID()
  id: string;
}
