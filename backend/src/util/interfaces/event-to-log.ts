import { Logger } from '@nestjs/common';

export interface EventToLog {
  toFormattedLog(logger: Logger): void;
}
