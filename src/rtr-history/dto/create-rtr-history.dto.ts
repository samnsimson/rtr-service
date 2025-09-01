import { IsString, IsOptional, IsUUID } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateRTRHistoryInput {
  @Field()
  @IsUUID()
  rtrId: string;

  @Field()
  @IsUUID()
  userId: string;

  @Field()
  @IsString()
  action: string; // e.g., "created", "sent", "viewed", "signed", "expired"

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  details?: string;
}
