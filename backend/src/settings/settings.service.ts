import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SettingsService {
  constructor(@Inject(PrismaService) private database: PrismaService) {}

  async createSettingsFromObject(settings: {
    guildId: number;
    introChannelId: number;
    openIntroChannelId: number;
    leaveChannelId: number;
    welcomeMessageFormat: string;
    leaveMessageFormat: string;
    verifiedMemberRoleId: number;
    unverifiedMemberRoleId: number;
  }) {
    const newSettings = await this.database.settings.create({
      data: settings,
    });
    return newSettings;
  }

  async createSettings(guildId: number) {
    const settings = await this.database.settings.create({
      data: { guildId },
    });
    return settings;
  }

  async getSettings(guildId: number) {
    const settings = await this.database.settings.findUnique({
      where: { guildId },
    });
    return settings;
  }
  // Implement getters and setters for the all setting attributes given in the database schema
  async getIntroChannelId(guildId: number) {
    const settings = await this.database.settings.findUnique({
      where: { guildId },
    });
    return settings.introChannelId;
  }
  async setIntroChannelId(guildId: number, channelId: number) {
    await this.database.settings.update({
      where: { guildId },
      data: { introChannelId: channelId },
    });
  }

  async getOpenIntroChannelId(guildId: number) {
    const settings = await this.database.settings.findUnique({
      where: { guildId },
    });
    return settings.openIntroChannelId;
  }

  async setOpenIntroChannelId(guildId: number, channelId: number) {
    await this.database.settings.update({
      where: { guildId },
      data: { openIntroChannelId: channelId },
    });
  }

  async getLeaveChannelId(guildId: number) {
    const settings = await this.database.settings.findUnique({
      where: { guildId },
    });
    return settings.leaveChannelId;
  }

  async setLeaveChannelId(guildId: number, channelId: number) {
    await this.database.settings.update({
      where: { guildId },
      data: { leaveChannelId: channelId },
    });
  }

  async getWelcomeMessageFormat(guildId: number) {
    const settings = await this.database.settings.findUnique({
      where: { guildId },
    });
    return settings.welcomeMessageFormat;
  }
  async setWelcomeMessageFormat(guildId: number, format: string) {
    await this.database.settings.update({
      where: { guildId },
      data: { welcomeMessageFormat: format },
    });
  }

  async getLeaveMessageFormat(guildId: number) {
    const settings = await this.database.settings.findUnique({
      where: { guildId },
    });
    return settings.leaveMessageFormat;
  }

  async setLeaveMessageFormat(guildId: number, format: string) {
    await this.database.settings.update({
      where: { guildId },
      data: { leaveMessageFormat: format },
    });
  }

  async getVerifiedMemberRoleId(guildId: number) {
    const settings = await this.database.settings.findUnique({
      where: { guildId },
    });
    return settings.verifiedMemberRoleId;
  }

  async setVerifiedMemberRoleId(guildId: number, roleId: number) {
    await this.database.settings.update({
      where: { guildId },
      data: { verifiedMemberRoleId: roleId },
    });
  }

  async getUnverifiedMemberRoleId(guildId: number) {
    const settings = await this.database.settings.findUnique({
      where: { guildId },
    });
    return settings.unverifiedMemberRoleId;
  }

  async setUnverifiedMemberRoleId(guildId: number, roleId: number) {
    await this.database.settings.update({
      where: { guildId },
      data: { unverifiedMemberRoleId: roleId },
    });
  }
}
