import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SettingsService {
  constructor(@Inject(PrismaService) private database: PrismaService) {}

  async createSettingsFromObject(settings: {
    guildId: string;
    introChannelId: string;
    openIntroChannelId: string;
    leaveChannelId: string;
    welcomeMessageFormat: string;
    leaveMessageFormat: string;
    verifiedMemberRoleId: string;
    unverifiedMemberRoleId: string;
    modRoleId: string;
  }) {
    const newSettings = await this.database.settings.create({
      data: settings,
    });
    return newSettings;
  }

  async createSettings(guildId: string) {
    const settings = await this.database.settings.create({
      data: { guildId: guildId },
    });
    return settings;
  }

  async getSettings(guildId: string) {
    const settings = await this.database.settings.findUnique({
      where: { guildId: guildId },
    });
    return settings;
  }
  // Implement getters and setters for the all setting attributes given in the database schema
  async getIntroChannelId(guildId: string) {
    const settings = await this.database.settings.findUnique({
      where: { guildId: guildId },
    });
    return settings.introChannelId.toString();
  }
  async setIntroChannelId(guildId: string, channelId: string) {
    await this.database.settings.update({
      where: { guildId: guildId },
      data: { introChannelId: channelId },
    });
  }

  async getOpenIntroChannelId(guildId: string) {
    const settings = await this.database.settings.findUnique({
      where: { guildId: guildId },
    });
    return settings.openIntroChannelId.toString();
  }

  async setOpenIntroChannelId(guildId: string, channelId: string) {
    await this.database.settings.update({
      where: { guildId: guildId },
      data: { openIntroChannelId: channelId },
    });
  }

  async getLeaveChannelId(guildId: string) {
    const settings = await this.database.settings.findUnique({
      where: { guildId: guildId },
    });
    return settings.leaveChannelId.toString();
  }

  async setLeaveChannelId(guildId: string, channelId: string) {
    await this.database.settings.update({
      where: { guildId: guildId },
      data: { leaveChannelId: channelId },
    });
  }

  async getWelcomeMessageFormat(guildId: string) {
    const settings = await this.database.settings.findUnique({
      where: { guildId: guildId },
    });
    return settings.welcomeMessageFormat;
  }
  async setWelcomeMessageFormat(guildId: string, format: string) {
    await this.database.settings.update({
      where: { guildId: guildId },
      data: { welcomeMessageFormat: format },
    });
  }

  async getLeaveMessageFormat(guildId: string) {
    const settings = await this.database.settings.findUnique({
      where: { guildId: guildId },
    });
    return settings.leaveMessageFormat;
  }

  async setLeaveMessageFormat(guildId: string, format: string) {
    await this.database.settings.update({
      where: { guildId: guildId },
      data: { leaveMessageFormat: format },
    });
  }

  async getVerifiedMemberRoleId(guildId: string) {
    const settings = await this.database.settings.findUnique({
      where: { guildId: guildId },
    });
    return settings.verifiedMemberRoleId.toString();
  }

  async setVerifiedMemberRoleId(guildId: string, roleId: string) {
    await this.database.settings.update({
      where: { guildId: guildId },
      data: { verifiedMemberRoleId: roleId },
    });
  }

  async getUnverifiedMemberRoleId(guildId: string) {
    const settings = await this.database.settings.findUnique({
      where: { guildId: guildId },
    });
    return settings.unverifiedMemberRoleId.toString();
  }

  async setUnverifiedMemberRoleId(guildId: string, roleId: string) {
    await this.database.settings.update({
      where: { guildId: guildId },
      data: { unverifiedMemberRoleId: roleId },
    });
  }

  async getModRoleId(guildId: string) {
    const settings = await this.database.settings.findUnique({
      where: { guildId: guildId },
    });
    return settings.modRoleId.toString();
  }

  async setModRoleId(guildId: string, roleId: string) {
    await this.database.settings.update({
      where: { guildId: guildId },
      data: { modRoleId: roleId },
    });
  }
  async getAdminRoleId(guildId: string) {
    const settings = await this.database.settings.findUnique({
      where: { guildId: guildId },
    });
    return settings.adminRoleId.toString();
  }

  async setAdminRoleId(guildId: string, roleId: string) {
    await this.database.settings.update({
      where: { guildId: guildId },
      data: { adminRoleId: roleId },
    });
  }
}
