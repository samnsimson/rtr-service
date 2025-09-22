import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsBoolean } from 'class-validator';

@InputType()
export class OverviewQueryInput {
  @Field(() => Boolean, { nullable: true, defaultValue: true })
  @IsOptional()
  @IsBoolean()
  includeMonthlyMetrics: boolean;

  @Field(() => Boolean, { nullable: true, defaultValue: true })
  @IsOptional()
  @IsBoolean()
  includeDetailedBreakdowns: boolean;

  @Field(() => Boolean, { nullable: true, defaultValue: true })
  @IsOptional()
  @IsBoolean()
  includeRtrMetrics: boolean;

  @Field(() => Boolean, { nullable: true, defaultValue: true })
  @IsOptional()
  @IsBoolean()
  includeJobMetrics: boolean;

  @Field(() => Boolean, { nullable: true, defaultValue: true })
  @IsOptional()
  @IsBoolean()
  includeApplicationMetrics: boolean;

  @Field(() => Boolean, { nullable: true, defaultValue: true })
  @IsOptional()
  @IsBoolean()
  includeUserMetrics: boolean;
}
