import { IsNumber, IsOptional, Min } from 'class-validator';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class PaginationDto {
  @Field(() => Int, { defaultValue: 10, nullable: true })
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit: number;

  @Field(() => Int, { defaultValue: 1, nullable: true })
  @IsNumber()
  @Min(1)
  @IsOptional()
  page: number;
}
