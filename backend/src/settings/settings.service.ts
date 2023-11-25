import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Settings } from '@prisma/client';
import { GuildDoesNotExistException } from '../util/exception/guild-does-not-exist-exception';
import { omit } from 'rambda/immutable';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SettingsChanged } from './events/settings-role-id-changed.event';

@Injectable()
export class SettingsService {
  constructor(
    @Inject(PrismaService) private database: PrismaService,
    @Inject(EventEmitter2) private eventEmitter: EventEmitter2,
  ) {}

  async createSettings(guildId: string) {
    return await this.database.settings.create({
      data: { guildId: guildId },
    });
  }

  async editSettings(
    guildId: string,
    settings: Partial<Omit<Settings, 'guildId'>>,
  ) {
    Object.keys(settings).forEach(async (key) => {
      if (key.endsWith('RoleId')) {
        await this.eventEmitter.emitAsync(`settings.role.${key}.changed`, {
          guildId: guildId,
          value: settings[key],
          eventType: key,
        } as SettingsChanged);
      }
    });
    await this.database.settings.update({ where: { guildId }, data: settings });
  }

  async getSettings(guildId: string) {
    const settings = await this.database.settings.findUnique({
      where: { guildId: guildId },
    });
    if (!settings) {
      throw new GuildDoesNotExistException(guildId);
    }
    return omit(['guildId'], settings);
  }

  async getVerifiedMemberRoleId(guildId: string) {
    return await this.getSettings(guildId).then(
      (it) => it.verifiedMemberRoleId,
    );
  }

  async getUnverifiedMemberRoleId(guildId: string) {
    return this.getSettings(guildId).then((it) => it.unverifiedMemberRoleId);
  }

  async getModRoleId(guildId: string) {
    return this.getSettings(guildId).then((it) => it.modRoleId);
  }

  async getAdminRoleId(guildId: string) {
    return this.getSettings(guildId).then((it) => it.adminRoleId);
  }

  async getWelcomeMessageFormat(guildId: string) {
    return this.getSettings(guildId).then((it) => it.welcomeMessageFormat);
  }

  async getOpenIntroChannelId(guildId: string) {
    return this.getSettings(guildId).then((it) => it.openIntroChannelId);
  }

  async getIntroChannelId(guildId: string) {
    return this.getSettings(guildId).then((it) => it.introChannelId);
  }
}
