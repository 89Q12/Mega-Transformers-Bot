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
import { SettingsDto } from './dto/settings.dto';
import { GuildSettingsService } from './guild-settings.service';
import { plainToInstance } from '../../util/functions/plain-to-instance';
import { HttpStatusCode } from 'axios';
import { RequiredRank } from 'src/util/decorators/requires-rank.decorator';
import { Rank } from '@prisma/client';
import { HasRequiredRank } from 'src/util/guards/has-required-rank.guard';

@Controller('settings')
@RequiredRank(Rank.MOD)
@UseGuards(JwtAuthGuard, HasRequiredRank)
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
