import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Message } from 'discord.js';

interface DiscordExecutionContext extends ExecutionContext {
  getMessage(): Message;
}
@Injectable()
export class IsUserUnlockedGuard implements CanActivate {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}
  canActivate(context: DiscordExecutionContext): boolean {
    const message: Message = context.getArgByIndex(0);
    return message.member.roles.cache.has(
      this.configService.get<string>('ROLE_ID_OF_ROLE_FOR_UNLOCKED_MEMBER'),
    );
  }
}
