export class SlowmodeEnabled {
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
}

export class SlowmodeDisabled {
  guildId: string;
  channelId: string;
  enabled: boolean;

  constructor(guildId: string, channelId: string, enabled: boolean) {
    this.guildId = guildId;
    this.channelId = channelId;
    this.enabled = enabled;
  }
}

export class ChannelCleaned {
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
}
