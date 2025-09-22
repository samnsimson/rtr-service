import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { JobCreatedEvent, EVENTS } from '../../common/events/events.types';

@Injectable()
export class JobEventsListener {
  private readonly logger = new Logger(JobEventsListener.name);

  @OnEvent(EVENTS.JOB_CREATED)
  async handleJobCreated(event: JobCreatedEvent) {
    try {
      this.logger.log(`Job created: ${event.jobId} for organization: ${event.organizationId}`);
      // Could trigger notifications, search indexing, or other non-blocking operations
      // await this.notificationService.sendJobCreatedNotification(event);
      // await this.searchService.indexJob(event.jobId);
    } catch (error) {
      this.logger.error(`Failed to handle job creation for ${event.jobId}:`, error);
    }
  }
}
