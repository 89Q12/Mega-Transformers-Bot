import { Awaitable, ClientEvents } from 'discord.js';

export default interface BotEvent<key extends keyof ClientEvents>{
    event: string;
    run(...args: ClientEvents[key]): Awaitable<any>;
};