import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { JobApplicationCreatedEvent, EVENTS } from '../../common/events/events.types';

@Injectable()
export class JobApplicationEventsListener {
  private readonly logger = new Logger(JobApplicationEventsListener.name);

  @OnEvent(EVENTS.JOB_APPLICATION_CREATED)
  async handleJobApplicationCreated(event: JobApplicationCreatedEvent) {
    try {
      this.logger.log(`Job application created: ${event.applicationId} for organization: ${event.organizationId}`);
      // Could trigger notifications, email alerts, or other non-blocking operations
      // await this.notificationService.sendApplicationNotification(event);
      // await this.emailService.sendApplicationConfirmation(event);
    } catch (error) {
      this.logger.error(`Failed to handle job application creation for ${event.applicationId}:`, error);
    }
  }
}
