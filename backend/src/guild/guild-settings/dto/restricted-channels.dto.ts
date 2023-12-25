import { ApiProperty } from '@nestjs/swagger';
import { RestrictedChannels } from '@prisma/client';
import { IsNumber, IsString } from 'class-validator';

export class RestrictedChannelDto
  implements Omit<RestrictedChannels, 'guildId'>
{
  @IsString()
  @ApiProperty({
    type: String,
  })
  channelId: string;
  @IsNumber()
  @ApiProperty({
    type: Number,
  })
  requiredPoints: number;
}
