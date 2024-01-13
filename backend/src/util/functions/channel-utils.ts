import { Logger } from '@nestjs/common';
import { Collection, GuildTextBasedChannel, Message } from 'discord.js';

export default async function cleanTextChannel(
  channel: GuildTextBasedChannel,
  stopCb: (messages: Collection<string, Message<true>>) => boolean,
  filterCb: (message: Message<true>) => boolean,
  logger: Logger,
): Promise<void> {
  let stop = false;
  let pointer: string;
  while (!stop) {
    try {
      const messages = await channel.messages.fetch({
        limit: 100,
        before: pointer,
      });
      pointer = messages.last() === undefined ? '0' : messages.last().id;
      stop = stopCb(messages);
      messages
        .filter((msg) => filterCb(msg))
        .forEach((msg) => {
          logger.log(`Deleting message ${msg.id}`);
          msg.delete().catch((err) => logger.error(err));
        });
    } catch {
      logger.log(`Failed to fetch messages before ${pointer}`);
      stop = true;
    }
  }
}
