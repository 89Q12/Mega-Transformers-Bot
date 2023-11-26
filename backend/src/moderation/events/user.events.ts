import { Logger } from '@nestjs/common';
import { EventToLog } from 'src/util/interfaces/event-to-log';

export class UserBanEvent implements EventToLog {
  userId: string;
  guildId: string;
  reason: string;

  constructor(userId: string, guildId: string, reason: string) {
    this.userId = userId;
    this.guildId = guildId;
    this.reason = reason;
  }

  toFormattedLog(logger: Logger): void {
    logger.log(`UserBanEvent: ${this.userId} banned in guild ${this.guildId}`);
  }
}

export class UserKickEvent implements EventToLog {
  userId: string;
  guildId: string;
  reason: string;

  constructor(userId: string, guildId: string, reason: string) {
    this.userId = userId;
    this.guildId = guildId;
    this.reason = reason;
  }

  toFormattedLog(logger: Logger): void {
    logger.log(`UserKickEvent: ${this.userId} kicked in guild ${this.guildId}`);
  }
}

export class UserTimeOutEvent implements EventToLog {
  userId: string;
  guildId: string;
  reason: string;
  duration: number;

  constructor(
    userId: string,
    guildId: string,
    reason: string,
    duration: number,
  ) {
    this.userId = userId;
    this.guildId = guildId;
    this.reason = reason;
    this.duration = duration;
  }

  toFormattedLog(logger: Logger): void {
    logger.log(
      `UserTimeOutEvent: ${this.userId} timed out in guild ${this.guildId}`,
    );
  }
}

export class UserTimeOutFailedEvent implements EventToLog {
  userId: string;
  guildId: string;
  reason: string;
  duration: number;
  error: Error;

  constructor(
    userId: string,
    guildId: string,
    reason: string,
    duration: number,
    error: Error,
  ) {
    this.userId = userId;
    this.guildId = guildId;
    this.reason = reason;
    this.duration = duration;
    this.error = error;
  }

  toFormattedLog(logger: Logger): void {
    logger.error(
      `UserTimeOutFailedEvent: ${this.userId} failed to time out in guild ${this.guildId}, with error ${this.error.message}`,
    );
  }
}

export class UserPurgeEvent implements EventToLog {
  userId: string;
  guildId: string;
  reason: string;

  constructor(userId: string, guildId: string, reason: string) {
    this.userId = userId;
    this.guildId = guildId;
    this.reason = reason;
  }

  toFormattedLog(logger: Logger): void {
    logger.log(
      `UserPurgeEvent: ${this.userId} purged in guild ${this.guildId}`,
    );
  }
}

export class UserSendDMFailedEvent implements EventToLog {
  userId: string;
  guildId: string;
  error: Error;

  constructor(userId: string, guildId: string, error: Error) {
    this.userId = userId;
    this.guildId = guildId;
    this.error = error;
  }

  toFormattedLog(logger: Logger): void {
    logger.error(
      `UserSendDMFailedEvent: ${this.userId} failed to send DM in guild ${this.guildId}, with error ${this.error.message}`,
    );
  }
}
