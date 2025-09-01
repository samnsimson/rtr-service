import { PartialType } from '@nestjs/mapped-types';
import { Field, InputType } from '@nestjs/graphql';
import { CreateNotificationInput } from './create-notification.dto';

@InputType()
export class UpdateNotificationInput extends PartialType(CreateNotificationInput) {
  @Field()
  id: string;
}
