import { IsString, IsEnum, IsUUID, IsNumber, IsUrl } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';
import { DocumentType } from '../entities/document.entity';

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
  @IsUrl()
  url: string;

  @Field(() => Int)
  @IsNumber()
  size: number; // File size in bytes

  @Field()
  @IsString()
  mimeType: string;
}
