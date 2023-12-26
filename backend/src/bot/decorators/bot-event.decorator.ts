import { SetMetadata } from '@nestjs/common';
import { ClientEvents } from 'discord.js';
export const BOT_EVENT_KEY = '__bot_event__';
export const BOT_EVENT_HANDLER_NAME = '__bot_event_handler__';
export const BotEvent = (...event: Array<keyof ClientEvents>) =>
  SetMetadata(BOT_EVENT_KEY, event);
