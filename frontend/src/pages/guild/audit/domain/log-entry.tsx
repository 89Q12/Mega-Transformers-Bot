import { TargetType } from './target-type.tsx';
import { Action } from './action.tsx';

export interface LogEntry {
  action: Action;
  createdAt: string;
  invokerId: string;
  reason: string;
  targetId: string;
  targetType: TargetType;
}
