import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DiscordAuthGuard } from './discord-auth.guard';

@Controller('auth/discord')
export class AuthController {
  @Get()
  @UseGuards(DiscordAuthGuard)
  async discordAuth(@Req() req): Promise<any> {
    return {
      name: req.user.name,
      discord_id: req.user.user_id.toString(),
      id: req.user.id,
    };
  }
}
