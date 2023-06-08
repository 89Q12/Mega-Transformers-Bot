import { InjectDiscordClient } from '@discord-nestjs/core';
import { Controller } from '@nestjs/common';
import { Client } from 'discord.js';

@Controller('bot')
export class BotController {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
  ) {}
}
