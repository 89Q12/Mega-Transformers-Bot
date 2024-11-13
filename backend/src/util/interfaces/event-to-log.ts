import { Logger } from '@nestjs/common';

/**
 * Thrown events that implement this can be used to pretty print into the application log
 */
export interface EventToLog {
  /**
   * Pretty print function on thrown events within the app, not all events implement this!!
   * @param logger Logger which is used for logging to the nestjs app log
   */
  toFormattedLog(logger: Logger): void;
}
