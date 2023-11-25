import { Logger } from '@nestjs/common';
import { EventToLog } from 'src/util/interfaces/event-to-log';

export class SlowmodeEnabled implements EventToLog {
  guildId: string;
  channelId: string;
  enabled: boolean;
  seconds: number;

  constructor(
    guildId: string,
    channelId: string,
    enabled: boolean,
    seconds: number,
  ) {
    this.guildId = guildId;
    this.channelId = channelId;
    this.enabled = enabled;
    this.seconds = seconds;
  }

  toFormattedLog(logger: Logger): void {
    logger.log(
      `SlowmodeEnabled: ${this.seconds} seconds slowmode enabled in ${this.channelId} in guild ${this.guildId}`,
    );
  }
}

export class SlowmodeDisabled implements EventToLog {
  guildId: string;
  channelId: string;
  enabled: boolean;

  constructor(guildId: string, channelId: string, enabled: boolean) {
    this.guildId = guildId;
    this.channelId = channelId;
    this.enabled = enabled;
  }

  toFormattedLog(logger: Logger): void {
    logger.log(
      `SlowmodeDisabled Slowmode disabled in ${this.channelId} in guild ${this.guildId}`,
    );
  }
}

export class ChannelCleaned implements EventToLog {
  guildId: string;
  channelId: string;
  messagesDeleted: number;
  before: number;
  userId: string;

  constructor(
    guildId: string,
    channelId: string,
    messagesDeleted: number,
    before: number,
    userId: string,
  ) {
    this.guildId = guildId;
    this.channelId = channelId;
    this.messagesDeleted = messagesDeleted;
    this.before = before;
    this.userId = userId;
  }

  toFormattedLog(logger: Logger): void {
    logger.log(
      `ChannelCleaned: ${this.messagesDeleted} messages deleted in ${this.channelId} in guild ${this.guildId} for user ${this.userId}`,
    );
  }
}
