import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class JwtAuthService {
  constructor(private jwtService: JwtService) {}
  async login(user: User) {
    const payload = {
      username: user.name,
      sub: {
        name: user.name,
        user_id: user.user_id.toString(),
      },
    };
    return {
      user: {
        name: user.name,
        user_id: user.user_id.toString(),
      },
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }
  async refreshToken(user: { user: User; username: string }) {
    console.log(user);
    const payload = {
      username: user.username,
      sub: user.user,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
