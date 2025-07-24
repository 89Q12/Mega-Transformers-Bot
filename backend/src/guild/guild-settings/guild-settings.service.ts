import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Settings } from '@prisma/client';
import { GuildDoesNotExistException } from '../../util/exception/guild-does-not-exist-exception';
import { omit, pipe } from 'rambda';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SettingsChanged } from './events/settings-role-id-changed.event';
import { Message, userMention, quote } from 'discord.js';

@Injectable()
export class GuildSettingsService {
  constructor(
    @Inject(PrismaService) private database: PrismaService,
    @Inject(EventEmitter2) private eventEmitter: EventEmitter2,
  ) {}
  async editSettings(
    guildId: string,
    settings: Partial<Omit<Settings, 'guildId'>>,
  ) {
    Object.keys(settings).forEach(async (key) => {
      if (key.endsWith('RoleId')) {
        await this.eventEmitter.emitAsync(
          `settings.role.${key}.changed`,
          new SettingsChanged(guildId, settings[key], key as keyof Settings),
        );
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
    return pipe(settings, omit(['guildId']));
  }

  async getVerifiedMemberRoleId(guildId: string) {
    return this.getSettings(guildId).then((it) => it.verifiedMemberRoleId);
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
  async getModChannelId(guildId: string) {
    return this.getSettings(guildId).then((it) => it.modChannelId);
  }
  async templateMessage(message: Message): Promise<string> {
    // template message using the template string provided in the settings
    const template = await this.getWelcomeMessageFormat(message.guildId);
    // Usable variables:
    // ${user} - username
    // ${message} - message content
    const quotedMessage = message.content
      .split('\n')
      .map((it) => quote(it))
      .join('\n');
    return template
      .replace('{user}', userMention(message.author.id))
      .replace('{message}', `\n\n${quotedMessage}`);
  }
}
