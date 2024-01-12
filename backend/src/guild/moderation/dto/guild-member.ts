import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DiscordUser } from './user';

export class DiscordGuildMember {
  @IsString()
  @ApiProperty({ type: String })
  userId: DiscordUser['id'];
  @IsString()
  @ApiProperty({ type: String })
  guildId: string;
  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({ type: String, format: 'date-time' })
  communicationDisabledUntil?: string;
  @IsString()
  @ApiProperty({ type: String })
  displayName: string;
  @IsString()
  @ApiProperty({ type: String })
  username: string;
  @IsString()
  @ApiProperty({ type: String })
  avatarUrl: string;
  @IsBoolean()
  @ApiProperty({ type: Boolean })
  bot: boolean;
}
