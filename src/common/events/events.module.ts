import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventEmitterService } from './event-emitter.service';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      // Set this to `true` to use wildcards
      wildcard: false,
      // The delimiter used to segment namespaces
      delimiter: '.',
      // Set this to `true` if you want to emit the newListener event
      newListener: false,
      // Set this to `true` if you want to emit the removeListener event
      removeListener: false,
      // The maximum amount of listeners that can be assigned to an event
      maxListeners: 10,
      // Show event name in memory leak message when more than maximum amount of listeners is assigned
      verboseMemoryLeak: false,
      // Disable throwing uncaughtException if an error event is emitted and it has no listeners
      ignoreErrors: false,
    }),
  ],
  providers: [EventEmitterService],
  exports: [EventEmitterService],
})
export class EventsModule {}
