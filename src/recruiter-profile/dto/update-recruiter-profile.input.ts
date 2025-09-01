import { CreateRecruiterProfileInput } from './create-recruiter-profile.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRecruiterProfileInput extends PartialType(CreateRecruiterProfileInput) {
  @Field(() => Int)
  id: number;
}
