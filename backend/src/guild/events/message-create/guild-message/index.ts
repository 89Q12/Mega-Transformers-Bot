import { On } from '@discord-nestjs/core';
import { Inject, Injectable, UseGuards } from '@nestjs/common';
import { Attachment, Message } from 'discord.js';
import { MessageFromUserGuard } from 'src/bot/guards/message-from-user.guard';
import { ChannelIdGuard } from 'src/bot/guards/message-in-channel.guard';
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
  @UseGuards(MessageFromUserGuard, ChannelIdGuard('1121822614374060175'))
  async post_IntroductionFromUser(message: Message): Promise<void> {
    // Get first message from user in the introduction channel and post it to the open introduction channel
    const messages = await message.channel.messages.fetch({ limit: 1 });
    const firstMessage = messages.first();
    await this.guildUserService.upsert(
      firstMessage.author.id,
      message.guildId,
      {
        firstMessageId: firstMessage.id,
      },
    );
  }
  @On('messageCreate')
  @UseGuards(MessageFromUserGuard)
  async toniMsgsToBird(message: Message): Promise<void> {
    if (message.author.id === '1132244079242133555') {
      message.react('🐦');
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
        return ({}[attachment.contentType] = attachment);
      },
    );
  }
}
