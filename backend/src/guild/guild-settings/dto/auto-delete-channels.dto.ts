import { ApiProperty } from '@nestjs/swagger';
import { AutoDeleteChannels } from '@prisma/client';
import { IsString, Matches } from 'class-validator';

export class AutoDeleteChannelDto
  implements Omit<AutoDeleteChannels, 'guildId'>
{
  @IsString()
  @ApiProperty({ type: String })
  channelId: string;
  @IsString()
  @Matches('')
  @ApiProperty({ type: String })
  deleteAtCron: string;
}
