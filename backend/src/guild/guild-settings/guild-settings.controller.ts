import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt/guards/jwt-auth.guard';
import { IsModGuard } from '../../util/guards/is-mod.guard';
import { SettingsDto } from './dto/settings.dto';
import { GuildSettingsService } from './guild-settings.service';
import { plainToInstance } from '../../util/functions/plain-to-instance';
import { HttpStatusCode } from 'axios';

@Controller()
@UseGuards(JwtAuthGuard, IsModGuard)
export class GuildSettingsController {
  constructor(private readonly settingsService: GuildSettingsService) {}

  @Get()
  async getSettings(@Param('guildId') guildId: string): Promise<SettingsDto> {
    const settings = await this.settingsService.getSettings(guildId);
    return plainToInstance(SettingsDto, settings);
  }

  @Put()
  @HttpCode(HttpStatusCode.Accepted)
  async putSettings(
    @Param('guildId') guildId: string,
    @Body() body: SettingsDto,
  ) {
    await this.settingsService.editSettings(guildId, body);
  }
}
