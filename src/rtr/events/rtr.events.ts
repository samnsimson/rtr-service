import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RTRCreatedEvent, EVENTS } from '../../common/events/events.types';

@Injectable()
export class RTREventsListener {
  private readonly logger = new Logger(RTREventsListener.name);

  @OnEvent(EVENTS.RTR_CREATED)
  handleRTRCreated(event: RTRCreatedEvent) {
    try {
      this.logger.log(`RTR created: ${event.rtrId} for organization: ${event.organizationId}`);
      // Could trigger notifications, analytics, or other non-blocking operations
      // await this.notificationService.sendRTRNotification(event);
      // await this.analyticsService.trackRTREvent(event);
    } catch (error) {
      this.logger.error(`Failed to handle RTR creation for ${event.rtrId}:`, error);
    }
  }
}
