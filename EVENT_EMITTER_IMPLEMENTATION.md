# Event Emitter Implementation

## Overview

This document describes the implementation of an event-driven architecture using NestJS EventEmitter to handle non-blocking operations and prevent circular dependencies.

## Architecture Benefits

### 1. **Circular Dependency Prevention**

- Organizations no longer directly depend on OverviewModule
- Overview creation is handled asynchronously via events
- Cleaner module dependencies

### 2. **Performance Optimization**

- Non-blocking operations don't slow down main business logic
- Overview creation happens in the background
- Better user experience with faster response times

### 3. **Scalability**

- Easy to add new event listeners for different operations
- Decoupled services that can be scaled independently
- Event-driven architecture supports microservices migration

## Implementation Details

### Core Components

#### 1. Event Emitter Service (`src/common/events/event-emitter.service.ts`)

- Wrapper around NestJS EventEmitter2
- Provides async and sync event emission
- Includes error handling and logging

#### 2. Event Types (`src/common/events/events.types.ts`)

- TypeScript interfaces for all events
- Event name constants for consistency
- Type safety for event data

#### 3. Events Module (`src/common/events/events.module.ts`)

- Configures EventEmitter2 with optimal settings
- Exports EventEmitterService globally

### Event Listeners

#### 1. Organization Events (`src/organizations/events/organization.events.ts`)

- Handles `ORGANIZATION_CREATED` events
- Creates default overview records asynchronously
- Includes error handling to prevent blocking

#### 2. RTR Events (`src/rtr/events/rtr.events.ts`)

- Handles `RTR_CREATED` events
- Ready for notifications, analytics, etc.

#### 3. Job Events (`src/jobs/events/job.events.ts`)

- Handles `JOB_CREATED` events
- Ready for search indexing, notifications

#### 4. Job Application Events (`src/job-applications/events/job-application.events.ts`)

- Handles `JOB_APPLICATION_CREATED` events
- Ready for email notifications, alerts

### Updated Services

#### Organizations Service

- **Before**: Direct call to `overviewService.createDefaultOverview()`
- **After**: Emits `ORGANIZATION_CREATED` event
- **Benefits**: Non-blocking, no circular dependency

#### RTR Service

- **Before**: No event emission
- **After**: Emits `RTR_CREATED` event after RTR creation
- **Benefits**: Enables analytics, notifications, etc.

## Event Flow Example

```
1. User creates organization
   ↓
2. OrganizationsService.createOrganization()
   ↓
3. Organization saved to database
   ↓
4. Event emitted: ORGANIZATION_CREATED
   ↓
5. OrganizationEventsListener.handleOrganizationCreated()
   ↓
6. OverviewService.createDefaultOverview() (async)
   ↓
7. Overview record created in background
```

## Configuration

### EventEmitter2 Settings

```typescript
EventEmitterModule.forRoot({
  wildcard: false, // No wildcard matching
  delimiter: '.', // Namespace delimiter
  newListener: false, // Don't emit newListener events
  removeListener: false, // Don't emit removeListener events
  maxListeners: 10, // Maximum listeners per event
  verboseMemoryLeak: false, // Memory leak warnings
  ignoreErrors: false, // Don't ignore errors
});
```

## Usage Examples

### Emitting Events

```typescript
// Sync emission (fire-and-forget)
this.eventEmitter.emit(EVENTS.ORGANIZATION_CREATED, eventData);

// Async emission (wait for all listeners)
await this.eventEmitter.emitAsync(EVENTS.ORGANIZATION_CREATED, eventData);
```

### Listening to Events

```typescript
@OnEvent(EVENTS.ORGANIZATION_CREATED)
async handleOrganizationCreated(event: OrganizationCreatedEvent) {
  // Handle event asynchronously
  await this.overviewService.createDefaultOverview(event.organizationId);
}
```

## Future Enhancements

### 1. Additional Events

- User creation/update events
- RTR status change events
- Job status change events
- Application status change events

### 2. Event Handlers

- Email notifications
- Search indexing
- Analytics tracking
- Audit logging
- Webhook notifications

### 3. Event Persistence

- Event store for audit trails
- Event replay capabilities
- Event sourcing patterns

### 4. Advanced Features

- Event filtering
- Event routing
- Dead letter queues
- Event versioning

## Testing

### Unit Tests

- Test event emission
- Test event listeners
- Test error handling

### Integration Tests

- Test complete event flows
- Test async operations
- Test error scenarios

## Monitoring

### Logging

- Event emission logs
- Event handler execution logs
- Error logs for failed events

### Metrics

- Event emission rates
- Event handler performance
- Error rates

## Migration Notes

### Breaking Changes

- None - this is an additive change
- Existing functionality remains unchanged

### Performance Impact

- Positive - non-blocking operations
- Slight memory overhead for event system
- Better overall application performance

## Conclusion

The event emitter implementation successfully:

1. ✅ Prevents circular dependencies
2. ✅ Improves performance with non-blocking operations
3. ✅ Provides a scalable architecture for future enhancements
4. ✅ Maintains backward compatibility
5. ✅ Enables better separation of concerns

This implementation sets the foundation for a more robust, scalable, and maintainable application architecture.
