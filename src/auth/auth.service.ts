import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async findUserFromDiscordId(discordId: string): Promise<any> {
    const user = await this.usersService.findOne(parseInt(discordId));

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
