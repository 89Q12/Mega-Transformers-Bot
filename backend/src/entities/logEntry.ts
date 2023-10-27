export default interface LogEntry {
  guildId: string;
  invokerId: string;
  action: string;
  reason: string;
  createdAt: Date;
  targetId: string;
  targetType: string;
  extraInfo: string;
}
