import { Settings } from '@prisma/client';
import { IsInstance, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AutoDeleteChannelDto } from './auto-delete-channels.dto';
import { RestrictedChannelDto } from './restricted-channels.dto';

export class SettingsDto implements Omit<Settings, 'guildId'> {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  prefix: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  welcomeMessageFormat: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  openIntroChannelId: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  introChannelId: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  leaveMessageFormat: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  leaveChannelId: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  unverifiedMemberRoleId: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  verifiedMemberRoleId: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  modRoleId: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  adminRoleId: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  modChannelId: string;
}
