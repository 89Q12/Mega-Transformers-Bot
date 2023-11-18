import { Collection, GuildTextBasedChannel, Message } from 'discord.js';

export default async function cleanTextChannel(
  channel: GuildTextBasedChannel,
  stopCb: (messages: Collection<string, Message<true>>) => boolean,
  filterCb: (message: Message<true>) => boolean,
): Promise<void> {
  let stop = false;
  let pointer: string;
  while (!stop) {
    const messages = await channel.messages.fetch({
      limit: 100,
      before: pointer,
    });
    pointer = messages.last() === undefined ? '0' : messages.last().id;
    stop = stopCb(messages);
    messages
      .filter((msg) => filterCb(msg))
      .forEach((msg) => {
        console.log('deleting message: ' + msg.id);
        msg.delete().catch((err) => console.error(err));
      });
  }
}
