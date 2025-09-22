import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrganizationCreatedEvent, OrganizationUpdatedEvent, OrganizationDeletedEvent, EVENTS } from '../../common/events/events.types';
import { OverviewService } from '../../overview/overview.service';

@Injectable()
export class OrganizationEventsListener {
  private readonly logger = new Logger(OrganizationEventsListener.name);

  constructor(private readonly overviewService: OverviewService) {}

  @OnEvent(EVENTS.ORGANIZATION_CREATED)
  async handleOrganizationCreated(event: OrganizationCreatedEvent) {
    try {
      this.logger.log(`Creating default overview for organization: ${event.organizationId}`);
      await this.overviewService.createDefaultOverview(event.organizationId);
      this.logger.log(`Successfully created overview for organization: ${event.organizationId}`);
    } catch (error) {
      this.logger.error(`Failed to create overview for organization ${event.organizationId}:`, error);
      // Don't throw error to prevent blocking the main operation
    }
  }

  @OnEvent(EVENTS.ORGANIZATION_UPDATED)
  async handleOrganizationUpdated(event: OrganizationUpdatedEvent) {
    try {
      this.logger.log(`Organization updated: ${event.organizationId}`);
      await this.overviewService.refreshOverview(event.organizationId);
    } catch (error) {
      this.logger.error(`Failed to handle organization update for ${event.organizationId}:`, error);
    }
  }

  @OnEvent(EVENTS.ORGANIZATION_DELETED)
  async handleOrganizationDeleted(event: OrganizationDeletedEvent) {
    try {
      this.logger.log(`Organization deleted: ${event.organizationId}`);
      await this.overviewService.deleteOverview(event.organizationId);
    } catch (error) {
      this.logger.error(`Failed to handle organization deletion for ${event.organizationId}:`, error);
    }
  }
}
