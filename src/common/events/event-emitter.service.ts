import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EventEmitterService {
  private readonly logger = new Logger(EventEmitterService.name);

  constructor(private readonly eventEmitter: EventEmitter2) {}

  async emitAsync(event: string, data?: any): Promise<void> {
    try {
      this.logger.debug(`Emitting event: ${event}`, data);
      await this.eventEmitter.emitAsync(event, data);
    } catch (error) {
      this.logger.error(`Error emitting event ${event}:`, error);
      throw error;
    }
  }

  emit(event: string, data?: any): void {
    try {
      this.logger.debug(`Emitting event: ${event}`, data);
      this.eventEmitter.emit(event, data);
    } catch (error) {
      this.logger.error(`Error emitting event ${event}:`, error);
      throw error;
    }
  }

  on(event: string, listener: (...args: any[]) => void): void {
    this.eventEmitter.on(event, listener);
  }

  once(event: string, listener: (...args: any[]) => void): void {
    this.eventEmitter.once(event, listener);
  }

  off(event: string, listener: (...args: any[]) => void): void {
    this.eventEmitter.off(event, listener);
  }
}
