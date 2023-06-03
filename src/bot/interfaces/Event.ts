import { Awaitable, ClientEvents } from 'discord.js';

export default interface BotEvent<key extends keyof ClientEvents>{
    run(...args: ClientEvents[key]): Awaitable<unknown>;
};