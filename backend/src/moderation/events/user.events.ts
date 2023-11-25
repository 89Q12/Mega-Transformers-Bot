export class UserBanEvent {
  userId: string;
  guildId: string;
  reason: string;

  constructor(userId: string, guildId: string, reason: string) {
    this.userId = userId;
    this.guildId = guildId;
    this.reason = reason;
  }
}

export class UserKickEvent {
  userId: string;
  guildId: string;
  reason: string;

  constructor(userId: string, guildId: string, reason: string) {
    this.userId = userId;
    this.guildId = guildId;
    this.reason = reason;
  }
}

export class UserTimeOutEvent {
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
}

export class UserPurgeEvent {
  userId: string;
  guildId: string;
  reason: string;

  constructor(userId: string, guildId: string, reason: string) {
    this.userId = userId;
    this.guildId = guildId;
    this.reason = reason;
  }
}
