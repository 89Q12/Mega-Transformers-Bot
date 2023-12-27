import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GuildUser } from '@prisma/client';

export class Guild {
  @ApiProperty({ type: String }) guildId: GuildUser['guildId'];
  @ApiProperty({ type: String }) name: string;
  @ApiProperty({ type: String }) image: string;
}

export class SelfDto {
  @ApiProperty({ type: String }) userId: GuildUser['userId'];
  @ApiProperty({ type: String }) avatarUrl: string;
  @ApiProperty({ type: String }) name: string;
  @ApiPropertyOptional({ type: [Guild] }) guilds: Guild[];
}
