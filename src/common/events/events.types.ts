export interface OrganizationCreatedEvent {
  organizationId: string;
  organizationName: string;
  ownerId: string;
  createdAt: Date;
}

export interface OrganizationUpdatedEvent {
  organizationId: string;
  organizationName?: string;
  updatedAt: Date;
}

export interface OrganizationDeletedEvent {
  organizationId: string;
  organizationName: string;
  deletedAt: Date;
}

export interface UserCreatedEvent {
  userId: string;
  organizationId: string;
  role: string;
  createdAt: Date;
}

export interface UserUpdatedEvent {
  userId: string;
  organizationId: string;
  role?: string;
  updatedAt: Date;
}

export interface RTRCreatedEvent {
  rtrId: string;
  organizationId: string;
  candidateId: string;
  recruiterId: string;
  createdAt: Date;
}

export interface JobCreatedEvent {
  jobId: string;
  organizationId: string;
  recruiterId: string;
  createdAt: Date;
}

export interface JobApplicationCreatedEvent {
  applicationId: string;
  organizationId: string;
  jobId: string;
  candidateId: string;
  createdAt: Date;
}

// Event names as constants
export const EVENTS = {
  ORGANIZATION_CREATED: 'organization.created',
  ORGANIZATION_UPDATED: 'organization.updated',
  ORGANIZATION_DELETED: 'organization.deleted',
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  RTR_CREATED: 'rtr.created',
  JOB_CREATED: 'job.created',
  JOB_APPLICATION_CREATED: 'job-application.created',
} as const;
