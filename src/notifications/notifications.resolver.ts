import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { NotificationsService } from './notifications.service';
import { CreateNotificationInput, NotificationResponse, UpdateNotificationInput } from './dto';

@Resolver(() => NotificationResponse)
export class NotificationsResolver {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Mutation(() => NotificationResponse)
  createNotification(@Args('createNotificationInput') createNotificationInput: CreateNotificationInput) {
    return this.notificationsService.create(createNotificationInput);
  }

  @Query(() => [NotificationResponse], { name: 'notifications' })
  findAll() {
    return this.notificationsService.findAll();
  }

  @Query(() => NotificationResponse, { name: 'notification' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.notificationsService.findOne(id);
  }

  @Mutation(() => NotificationResponse)
  updateNotification(@Args('id', { type: () => Int }) id: number, @Args('updateNotificationInput') updateNotificationInput: UpdateNotificationInput) {
    return this.notificationsService.update(id, updateNotificationInput);
  }

  @Mutation(() => NotificationResponse)
  removeNotification(@Args('id', { type: () => Int }) id: number) {
    return this.notificationsService.remove(id);
  }
}
