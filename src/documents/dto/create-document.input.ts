import { IsString, IsEnum, IsUUID, IsNumber } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';
import { DocumentType } from '../../common/enums';

@InputType()
export class CreateDocumentInput {
  @Field()
  @IsUUID()
  rtrId: string;

  @Field()
  @IsString()
  name: string;

  @Field(() => DocumentType)
  @IsEnum(DocumentType)
  type: DocumentType;

  @Field()
  @IsString()
  url: string;

  @Field(() => Int)
  @IsNumber()
  size: number;

  @Field()
  @IsString()
  mimeType: string;
}
