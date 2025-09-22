import { InputType, Field } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class CreateOverviewInput {
  @Field(() => String, { description: 'Organization ID' })
  @IsUUID()
  organizationId: string;

  @Field(() => Boolean, { description: 'Include monthly metrics', defaultValue: true })
  includeMonthlyMetrics: boolean;

  @Field(() => Boolean, { description: 'Include detailed breakdowns', defaultValue: true })
  includeDetailedBreakdowns: boolean;
}
