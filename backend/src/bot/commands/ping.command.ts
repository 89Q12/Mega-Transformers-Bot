import { Command, Handler, InjectDiscordClient } from '@discord-nestjs/core';
import { Client } from 'discord.js';

@Command({
  name: 'ping',
  description: 'Gets the ws gateway ping',
  defaultMemberPermissions: ['Administrator'],
})
export class PingCommand {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
  ) {}
  @Handler()
  onPlayCommand(): string {
    return `Ping is ${this.client.ws.ping} ms.`;
  }
}
