import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { EventToLog } from './util/interfaces/event-to-log';

@Injectable()
export class AppService {
  logger = new Logger('AppService');
  constructor(
    @Inject(EventEmitter2) private readonly eventEmitter: EventEmitter2,
  ) {}

  @OnEvent('**')
  handleEvent(event: any & EventToLog) {
    event.toFormattedLog(this.logger);
  }
}
