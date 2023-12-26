import { InjectDiscordClient } from '@discord-nestjs/core';
import { Client } from 'discord.js';
import {
  BOT_EVENT_KEY,
  BOT_EVENT_HANDLER_NAME,
} from '../decorators/bot-event.decorator';
import { ExternalContextCreator } from '@nestjs/core';

export class Explorer {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    private readonly externalContextCreator: ExternalContextCreator,
  ) {}
  public checkProviders(providers: any[]): void {
    for (const provider of providers) {
      const metadata = this.botEventDecorator(provider);
      if (metadata) {
        if (!this.hasHandlerMethod(provider)) {
          throw new Error(
            `The provider ${provider.name} does not have a handler method, does it implement BotEvent?`,
          );
        }
        const handler = this.externalContextCreator.create(
          provider,
          provider[BOT_EVENT_HANDLER_NAME],
          BOT_EVENT_HANDLER_NAME,
        );
        this.client.on(metadata, handler);
      }
    }
  }

  private botEventDecorator(provider: any) {
    return Reflect.getMetadata(BOT_EVENT_KEY, provider);
  }

  private hasHandlerMethod(provider: any): boolean {
    return (
      provider.prototype.hasOwnProperty(BOT_EVENT_HANDLER_NAME) &&
      typeof provider.prototype.handler === 'function'
    );
  }
}
