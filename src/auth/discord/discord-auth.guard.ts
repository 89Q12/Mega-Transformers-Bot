import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class DiscordAuthGuard extends AuthGuard('discord') {
  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new BadRequestException();
    }
    return user;
  }
}
