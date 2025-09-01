import { ObjectType, Field, Int } from '@nestjs/graphql';
import { DocumentType } from '../entities/document.entity';

@ObjectType()
export class DocumentResponseDto {
  @Field()
  id: string;

  @Field()
  rtrId: string;

  @Field()
  name: string;

  @Field(() => DocumentType)
  type: DocumentType;

  @Field()
  url: string;

  @Field(() => Int)
  size: number;

  @Field()
  mimeType: string;

  @Field()
  uploadedAt: Date;
}
