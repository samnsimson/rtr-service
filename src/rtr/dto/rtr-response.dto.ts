import { ObjectType, Field } from '@nestjs/graphql';
import { RTRStatus } from '../entities/rtr.entity';

@ObjectType()
export class RTRResponseDto {
  @Field()
  id: string;

  @Field()
  candidateId: string;

  @Field()
  recruiterId: string;

  @Field({ nullable: true })
  jobId?: string;

  @Field(() => RTRStatus)
  status: RTRStatus;

  @Field({ nullable: true })
  notes?: string;

  @Field({ nullable: true })
  expiresAt?: Date;

  @Field({ nullable: true })
  signedAt?: Date;

  @Field({ nullable: true })
  viewedAt?: Date;

  @Field({ nullable: true })
  userId?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
