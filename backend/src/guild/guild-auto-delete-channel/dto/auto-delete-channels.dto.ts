import { ApiProperty } from '@nestjs/swagger';
import { AutoDeleteChannels } from '@prisma/client';
import { IsString, Matches } from 'class-validator';

export class GuildAutoDeleteChannelDto
  implements Omit<AutoDeleteChannels, 'guildId'>
{
  @IsString()
  @ApiProperty({ type: String })
  channelId: string;
  @IsString()
  @Matches(/^(((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7}$/, {
    message: 'Invalid cron expression',
  })
  @ApiProperty({ type: String })
  deleteAtCron: string;
}
