import { Module } from '@nestjs/common';
import { GuildSettingsService } from './guild-settings.service';
import { PrismaService } from 'src/prisma.service';
import { GuildSettingsController } from './guild-settings.controller';

@Module({
  providers: [GuildSettingsService, PrismaService],
  controllers: [GuildSettingsController],
  exports: [GuildSettingsService],
})
export class GuildSettingsModule {}
