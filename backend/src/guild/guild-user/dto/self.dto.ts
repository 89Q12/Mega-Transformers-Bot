import { GuildUser } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class SelfDto {
  @ApiProperty({ type: String }) userId: GuildUser['userId'];
  @ApiProperty({ type: String }) guildId: GuildUser['guildId'];
  @ApiProperty({ type: String }) rank: GuildUser['rank'];
  @ApiProperty({ type: String }) avatarUrl: string;
  @ApiProperty({ type: String }) name: string;
}
