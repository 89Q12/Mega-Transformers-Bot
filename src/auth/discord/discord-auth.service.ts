import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(profile: { id: string; username: string }): Promise<any> {
    const user = await this.usersService.findOneOrCreate(profile);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
