import { Injectable } from '@nestjs/common';
import { CreateNotificationInput, UpdateNotificationDto } from './dto';

@Injectable()
export class NotificationsService {
  create(createNotificationInput: CreateNotificationInput) {
    return 'This action adds a new notification';
  }

  findAll() {
    return `This action returns all notifications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationInput: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
