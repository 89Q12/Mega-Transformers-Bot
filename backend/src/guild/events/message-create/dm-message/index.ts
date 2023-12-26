import { On } from '@discord-nestjs/core';
import { Injectable, Logger, UseGuards } from '@nestjs/common';
import {
  Message,
  ActionRowBuilder,
  ButtonBuilder,
  DiscordAPIError,
} from 'discord.js';
import { MessageIsDmGuard } from 'src/bot/guards/message-is-dm.guard';
import { needHelpButton } from 'src/util/functions/menu-helper';

@Injectable()
export class DmMessageHandler {
  logger = new Logger(DmMessageHandler.name);

  @On('messageCreate')
  @UseGuards(MessageIsDmGuard)
  async dmMessageToModTeam(message: Message): Promise<void> {
    try {
      await message.reply({
        content:
          'Ich bin zwar nur ein Bot und kann kein Koverstionen führen, aber ich kann dir helfen. Klicke auf den Button, um Hilfe zu bekommen.',
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(needHelpButton()),
        ],
      });
    } catch (e: unknown) {
      this.logger.error((e as DiscordAPIError).message);
      console.log(e);
    }
  }
}
