import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class JwtAuthService {
  constructor(private jwtService: JwtService) {}
  async login(user: User) {
    const payload = { username: user.name, sub: user.user_id.toString() };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
