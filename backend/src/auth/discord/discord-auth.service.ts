import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../users/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UserService) {}

  async validateUser(profile: { id: string; username: string }): Promise<any> {
    const user = await this.usersService.findOne(profile.id);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
