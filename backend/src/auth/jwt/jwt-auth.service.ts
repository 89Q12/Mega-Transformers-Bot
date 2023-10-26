import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtAuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly usersService: UserService,
  ) {}
  async login(user: User) {
    const payload = {
      sub: {
        name: user.name,
        user_id: user.userId.toString(),
      },
    };
    return {
      user: {
        name: user.name,
        user_id: user.userId.toString(),
      },
      accessToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        issuer: this.configService.get<string>('JWT_ISSUER'),
        algorithm: 'HS256',
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        issuer: this.configService.get<string>('JWT_ISSUER'),
        algorithm: 'HS256',
      }),
    };
  }
  async refreshToken(user: { user: User }) {
    const payload = {
      sub: user.user,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
  async validateUser(profile: { id: string; username: string }): Promise<any> {
    const user = await this.usersService.findOne(profile.id);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
