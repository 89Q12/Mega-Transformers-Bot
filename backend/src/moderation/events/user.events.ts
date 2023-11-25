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
