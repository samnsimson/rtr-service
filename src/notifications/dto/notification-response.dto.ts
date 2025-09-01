import { ObjectType, Field } from '@nestjs/graphql';
import { NotificationType } from '../entities/notification.entity';

@ObjectType()
export class NotificationResponseDto {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  title: string;

  @Field()
  message: string;

  @Field(() => NotificationType)
  type: NotificationType;

  @Field()
  isRead: boolean;

  @Field({ nullable: true })
  data?: any;

  @Field()
  createdAt: Date;
}
