import { CreateOverviewInput } from './create-overview.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateOverviewInput extends PartialType(CreateOverviewInput) {
  @Field(() => String, { description: 'Overview ID' })
  id: string;
}
