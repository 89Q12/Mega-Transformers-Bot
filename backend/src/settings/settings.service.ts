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
    modRoleId: number;
  }) {
    const newSettings = await this.database.settings.create({
      data: settings,
    });
    return newSettings;
  }

  async createSettings(guildId: string) {
    const settings = await this.database.settings.create({
      data: { guildId: this.stringToNumber(guildId) },
    });
    return settings;
  }

  async getSettings(guildId: string) {
    const settings = await this.database.settings.findUnique({
      where: { guildId: this.stringToNumber(guildId) },
    });
    return settings;
  }
  // Implement getters and setters for the all setting attributes given in the database schema
  async getIntroChannelId(guildId: string) {
    const settings = await this.database.settings.findUnique({
      where: { guildId: this.stringToNumber(guildId) },
    });
    return settings.introChannelId.toString();
  }
  async setIntroChannelId(guildId: string, channelId: string) {
    await this.database.settings.update({
      where: { guildId: this.stringToNumber(guildId) },
      data: { introChannelId: this.stringToNumber(channelId) },
    });
  }

  async getOpenIntroChannelId(guildId: string) {
    const settings = await this.database.settings.findUnique({
      where: { guildId: this.stringToNumber(guildId) },
    });
    return settings.openIntroChannelId.toString();
  }

  async setOpenIntroChannelId(guildId: string, channelId: string) {
    await this.database.settings.update({
      where: { guildId: this.stringToNumber(guildId) },
      data: { openIntroChannelId: this.stringToNumber(channelId) },
    });
  }

  async getLeaveChannelId(guildId: string) {
    const settings = await this.database.settings.findUnique({
      where: { guildId: this.stringToNumber(guildId) },
    });
    return settings.leaveChannelId.toString();
  }

  async setLeaveChannelId(guildId: string, channelId: string) {
    await this.database.settings.update({
      where: { guildId: this.stringToNumber(guildId) },
      data: { leaveChannelId: this.stringToNumber(channelId) },
    });
  }

  async getWelcomeMessageFormat(guildId: string) {
    const settings = await this.database.settings.findUnique({
      where: { guildId: this.stringToNumber(guildId) },
    });
    return settings.welcomeMessageFormat;
  }
  async setWelcomeMessageFormat(guildId: string, format: string) {
    await this.database.settings.update({
      where: { guildId: this.stringToNumber(guildId) },
      data: { welcomeMessageFormat: format },
    });
  }

  async getLeaveMessageFormat(guildId: string) {
    const settings = await this.database.settings.findUnique({
      where: { guildId: this.stringToNumber(guildId) },
    });
    return settings.leaveMessageFormat;
  }

  async setLeaveMessageFormat(guildId: string, format: string) {
    await this.database.settings.update({
      where: { guildId: this.stringToNumber(guildId) },
      data: { leaveMessageFormat: format },
    });
  }

  async getVerifiedMemberRoleId(guildId: string) {
    const settings = await this.database.settings.findUnique({
      where: { guildId: this.stringToNumber(guildId) },
    });
    return settings.verifiedMemberRoleId.toString();
  }

  async setVerifiedMemberRoleId(guildId: string, roleId: string) {
    await this.database.settings.update({
      where: { guildId: this.stringToNumber(guildId) },
      data: { verifiedMemberRoleId: this.stringToNumber(roleId) },
    });
  }

  async getUnverifiedMemberRoleId(guildId: string) {
    const settings = await this.database.settings.findUnique({
      where: { guildId: this.stringToNumber(guildId) },
    });
    return settings.unverifiedMemberRoleId.toString();
  }

  async setUnverifiedMemberRoleId(guildId: string, roleId: string) {
    await this.database.settings.update({
      where: { guildId: this.stringToNumber(guildId) },
      data: { unverifiedMemberRoleId: this.stringToNumber(roleId) },
    });
  }

  async getModRoleId(guildId: string) {
    const settings = await this.database.settings.findUnique({
      where: { guildId: this.stringToNumber(guildId) },
    });
    return settings.modRoleId.toString();
  }

  async setModRoleId(guildId: string, roleId: string) {
    await this.database.settings.update({
      where: { guildId: this.stringToNumber(guildId) },
      data: { modRoleId: this.stringToNumber(roleId) },
    });
  }
  async getAdminRoleId(guildId: string) {
    const settings = await this.database.settings.findUnique({
      where: { guildId: this.stringToNumber(guildId) },
    });
    return settings.adminRoleId.toString();
  }

  async setAdminRoleId(guildId: string, roleId: string) {
    await this.database.settings.update({
      where: { guildId: this.stringToNumber(guildId) },
      data: { adminRoleId: this.stringToNumber(roleId) },
    });
  }
  private stringToNumber(string: string) {
    return parseInt(string);
  }
}
