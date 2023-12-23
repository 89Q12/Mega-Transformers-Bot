import { Logger } from '@nestjs/common';
import { Settings } from '@prisma/client';
import { EventToLog } from 'src/util/interfaces/event-to-log';

export class SettingsChanged implements EventToLog {
  guildId: string;
  value: string | number | boolean;
  eventType: keyof Settings;

  constructor(
    guildId: string,
    value: string | number | boolean,
    eventType: keyof Settings,
  ) {
    this.guildId = guildId;
    this.value = value;
    this.eventType = eventType;
  }

  toFormattedLog(logger: Logger): void {
    logger.log(`SettingsChanged: ${this.eventType} changed to ${this.value}`);
  }
}
