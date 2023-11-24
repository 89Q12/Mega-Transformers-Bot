import { Settings } from '@prisma/client';

export class SettingsChanged {
  guildId: string;
  value: string | number | boolean;
  eventType: keyof Settings;
}
