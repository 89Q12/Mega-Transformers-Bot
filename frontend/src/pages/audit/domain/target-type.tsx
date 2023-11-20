export const targetTypes = [
  'ERROR',
  'WARN',
  'USER',
  'GUILD',
  'INVALID_REQUEST',
  'INVITE',
  'MESSAGE',
  'ROLE',
  'CHANNEL',
] as const;
export type TargetType = (typeof targetTypes)[number];
