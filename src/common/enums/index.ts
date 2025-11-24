import { registerEnumType } from '@nestjs/graphql';

// User enums
export enum UserRole {
  ADMIN = 'ADMIN',
  ORGANIZATION_OWNER = 'ORGANIZATION_OWNER',
  ORGANIZATION_ADMIN = 'ORGANIZATION_ADMIN',
  RECRUITER = 'RECRUITER',
  RECRUITER_MANAGER = 'RECRUITER_MANAGER',
  CANDIDATE = 'CANDIDATE',
}

// Recruiter Profile enums
export enum CompanySize {
  STARTUP = 'STARTUP',
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  ENTERPRISE = 'ENTERPRISE',
}

// Candidate Profile enums
export enum RemotePreference {
  ANY = 'ANY',
  REMOTE_ONLY = 'REMOTE_ONLY',
  HYBRID_ONLY = 'HYBRID_ONLY',
  ON_SITE_ONLY = 'ON_SITE_ONLY',
}

// Job enums
export enum WorkType {
  REMOTE = 'REMOTE',
  HYBRID = 'HYBRID',
  ON_SITE = 'ON_SITE',
}

export enum JobType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  INTERNSHIP = 'INTERNSHIP',
  FREELANCE = 'FREELANCE',
}

export enum CompensationType {
  SALARY = 'SALARY',
  HOURLY = 'HOURLY',
  PROJECT_BASED = 'PROJECT_BASED',
  COMMISSION = 'COMMISSION',
}

export enum JobStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  CLOSED = 'CLOSED',
  DRAFT = 'DRAFT',
}

// RTR enums
export enum RTRStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  SENT = 'SENT',
  VIEWED = 'VIEWED',
  SIGNED = 'SIGNED',
  EXPIRED = 'EXPIRED',
  REJECTED = 'REJECTED',
}

// Job Application enums
export enum ApplicationStatus {
  APPLIED = 'APPLIED',
  REVIEWING = 'REVIEWING',
  INTERVIEWING = 'INTERVIEWING',
  OFFERED = 'OFFERED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

// Document enums
export enum DocumentType {
  RTR_FORM = 'RTR_FORM',
  RESUME = 'RESUME',
  COVER_LETTER = 'COVER_LETTER',
  CONTRACT = 'CONTRACT',
  OTHER = 'OTHER',
}

// Notification enums
export enum NotificationType {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  RTR_UPDATE = 'RTR_UPDATE',
  JOB_UPDATE = 'JOB_UPDATE',
}

export enum ExperiencePeriod {
  DAYS = 'DAYS',
  WEEKS = 'WEEKS',
  MONTHS = 'MONTHS',
  YEARS = 'YEARS',
}

export enum PlanType {
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
}

export enum BillingInterval {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}
export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  CANCELLED = 'CANCELLED',
  PAST_DUE = 'PAST_DUE',
  UNPAID = 'UNPAID',
}

export enum StripePaymentInterval {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

registerEnumType(StripePaymentInterval, { name: 'StripePaymentInterval' });

registerEnumType(SubscriptionStatus, { name: 'SubscriptionStatus' });

registerEnumType(PlanType, { name: 'PlanType' });

registerEnumType(BillingInterval, { name: 'BillingInterval' });

// Register all enums with GraphQL
registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'The role of the user in the system',
});

registerEnumType(CompanySize, {
  name: 'CompanySize',
  description: 'The size of the company',
});

registerEnumType(RemotePreference, {
  name: 'RemotePreference',
  description: 'The remote work preference of a candidate',
});

registerEnumType(WorkType, {
  name: 'WorkType',
  description: 'The type of work arrangement for a job',
});

registerEnumType(JobType, {
  name: 'JobType',
  description: 'The type of employment for a job',
});

registerEnumType(CompensationType, {
  name: 'CompensationType',
  description: 'The type of compensation for a job',
});

registerEnumType(JobStatus, {
  name: 'JobStatus',
  description: 'The current status of a job posting',
});

registerEnumType(RTRStatus, {
  name: 'RTRStatus',
  description: 'The status of a Right to Represent agreement',
});

registerEnumType(ApplicationStatus, {
  name: 'ApplicationStatus',
  description: 'The status of a job application',
});

registerEnumType(DocumentType, {
  name: 'DocumentType',
  description: 'The type of document being stored',
});

registerEnumType(NotificationType, {
  name: 'NotificationType',
  description: 'The type of notification being sent',
});

registerEnumType(ExperiencePeriod, {
  name: 'ExperiencePeriod',
  description: 'The period of experience (days, weeks, months, years)',
});
