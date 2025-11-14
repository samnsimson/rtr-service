import { ObjectType, Field } from '@nestjs/graphql';
import { ExperiencePeriod } from 'src/common';

@ObjectType()
export class SkillRequirement {
  @Field(() => String)
  skill: string;

  @Field(() => Number)
  experience: number;

  @Field(() => ExperiencePeriod, { defaultValue: ExperiencePeriod.YEARS })
  experiencePeriod: ExperiencePeriod;

  constructor(partial?: Partial<SkillRequirement>) {
    Object.assign(this, partial);
  }
}
