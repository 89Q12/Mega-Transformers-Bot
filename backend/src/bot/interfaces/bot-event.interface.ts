import { ClientEvents } from 'discord.js';

export default interface BotEvent {
  __bot_event_handler__(
    ...args: ClientEvents[keyof ClientEvents]
  ): Promise<void>;
}
