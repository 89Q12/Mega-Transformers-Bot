import { On } from '@discord-nestjs/core';
import { Inject, Injectable, UseGuards } from '@nestjs/common';
import { Attachment, GuildTextBasedChannel, Message } from 'discord.js';
import { MessageFromUserGuard } from 'src/bot/guards/message-from-user.guard';
import { IsUserUnlockedGuard } from 'src/bot/guards/user-is-unlocked.guard';
import { GuildUserService } from 'src/guild/guild-user/guild-user.service';
import getAttachmentType from 'src/util/functions/get-attachtment-type';

@Injectable()
export default class GuildMessageHandler {
  constructor(
    @Inject(GuildUserService)
    private readonly guildUserService: GuildUserService,
  ) {}
  @On('messageCreate')
  @UseGuards(MessageFromUserGuard, IsUserUnlockedGuard)
  async onMessage(message: Message): Promise<void> {
    await this.guildUserService.insertMessage(
      {
        userId: message.author.id,
        messageId: message.id,
        channelId: message.channelId,
        guildId: message.guildId,
        createdAt: new Date(message.createdTimestamp),
      },
      {
        messageId: message.id,
        length: message.content.length,
      },
      message.attachments.map((attachment: Attachment) => {
        return {
          type: getAttachmentType(attachment.contentType),
          url: attachment.url,
          messageId: message.id,
        };
      }),
      message.reactions.cache.map((reaction) => {
        return {
          messageId: message.id,
          emoji: reaction.emoji.toString(),
          count: reaction.count,
        };
      }),
    );
    await this.guildUserService.updateMessageCountBucket(
      message.author.id,
      message.guildId,
    );
  }

  @On('messageCreate')
  @UseGuards(MessageFromUserGuard)
  async toniMsgsToBird(message: Message): Promise<void> {
    const channel = message.channel as GuildTextBasedChannel;
    if (
      channel.parentId !== '1011529685357838376' &&
      channel.parentId !== '1051979218164125826'
    ) {
      if (message.author.id === '1132244079242133555')
        message.react('1194715694948946030');
    }
  }

  @On('messageCreate')
  @UseGuards(MessageFromUserGuard)
  async checkLimits(message: Message) {
    const guildUser = this.guildUserService.getGuildUser(
      message.author.id,
      message.guildId,
    );
    const hasAttachments = message.attachments.size > 0;
    const typeOfAttachments = message.attachments.map(
      (attachment: Attachment) => {
        return ({}[getAttachmentType(attachment.contentType)] = attachment);
      },
    );
  }
}
