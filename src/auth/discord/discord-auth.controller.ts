import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { DiscordAuthGuard } from './discord-auth.guard';
import { JwtAuthService } from '../jwt/jwt-auth.service';

@Controller('auth/discord')
export class AuthController {
  constructor(private jwtAuthService: JwtAuthService) {}
  @Get()
  @UseGuards(DiscordAuthGuard)
  async discordAuth(@Req() req): Promise<any> {
    return await this.jwtAuthService.login(req.user);
  }
}
