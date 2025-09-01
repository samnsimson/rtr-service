import { IsString, IsEnum, IsUUID, IsBoolean, IsOptional, IsObject } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { NotificationType } from '../entities/notification.entity';

@InputType()
export class CreateNotificationInput {
  @Field()
  @IsUUID()
  userId: string;

  @Field()
  @IsString()
  title: string;

  @Field()
  @IsString()
  message: string;

  @Field(() => NotificationType)
  @IsEnum(NotificationType)
  type: NotificationType;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsObject()
  data?: any; // Additional data for the notification
}
