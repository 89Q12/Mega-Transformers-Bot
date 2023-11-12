import LogEntry, {
  Action,
  actions,
  TargetType,
  targetTypes,
} from '../../util/dto/log.entry.dto';
import { ApiProperty } from '@nestjs/swagger';

export class LogEntryDto implements Omit<LogEntry, 'guildId'> {
  @ApiProperty({ type: 'string', enum: actions })
  action: Action;
  @ApiProperty({ type: 'string', format: 'date-time' })
  createdAt: Date;
  @ApiProperty({ type: 'string' })
  invokerId: string;
  @ApiProperty({ type: 'string' })
  reason: string;
  @ApiProperty({ type: 'string' })
  targetId: string;
  @ApiProperty({ type: 'string', enum: targetTypes })
  targetType: TargetType;
}
