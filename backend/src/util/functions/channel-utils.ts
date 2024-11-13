import { Logger } from '@nestjs/common';
import { Collection, GuildTextBasedChannel, Message } from 'discord.js';

/**
 * Utility function which deletes messages determined by the filterCb in a given channel until the stopCb returns false.
 * @param channel GuildTextBasedChannel -- the channel to clean
 * @param stopCb the callback which gets called to check if we should stop deleting messages
 * @param filterCb the callback used to filter out messages to delete
 * @param logger the logger used to log to the apps log
 */
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
