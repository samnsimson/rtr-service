import { ObjectType, Field } from '@nestjs/graphql';
import { CompensationType, RTRStatus } from '../../common/enums';

@ObjectType()
export class RtrResponse {
  @Field()
  id: string;

  @Field(() => String, { nullable: true })
  rtrId?: string;

  @Field()
  candidateFirstName: string;

  @Field()
  candidateLastName: string;

  @Field()
  candidateEmail: string;

  @Field()
  candidatePhone: string;

  @Field()
  compensation: number;

  @Field(() => CompensationType)
  compensationType: CompensationType;

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

  @Field()
  resumeRequired: boolean;

  @Field(() => Boolean)
  photoIdRequired: boolean;

  @Field(() => Boolean)
  employerDetailsRequired: boolean;

  @Field(() => Boolean)
  referencesRequired: boolean;

  @Field(() => Boolean)
  skillsRequired: boolean;

  @Field(() => String)
  createdById: string;

  @Field(() => String, { nullable: true })
  candidateId?: string;

  @Field(() => String)
  recruiterId: string;

  @Field(() => String)
  jobId: string;

  @Field(() => String)
  organizationId: string;

  @Field(() => String)
  rtrTemplateId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  constructor(partial?: Partial<RtrResponse>) {
    Object.assign(this, partial);
  }
}
