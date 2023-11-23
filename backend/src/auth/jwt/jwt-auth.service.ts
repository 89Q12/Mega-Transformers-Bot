import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { AxiosError } from 'axios';
import { OAuthErrorData } from 'discord.js';
import { firstValueFrom, catchError } from 'rxjs';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtAuthService {
  private readonly logger = new Logger(JwtAuthService.name);

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly usersService: UserService,
    private http: HttpService,
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
  async getUserFromCode(code: string): Promise<User> {
    const response = await firstValueFrom(
      this.http
        .post(
          'https://discordapp.com/api/oauth2/token',
          {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: this.configService.get('DISCORD_CALLBACK_URL'),
          },
          {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            auth: {
              username: this.configService.get('DISCORD_OAUTH_CLIENT_ID'),
              password: this.configService.get('DISCORD_OAUTH_SECRET'),
            },
          },
        )
        .pipe(
          catchError((error: AxiosError<OAuthErrorData>) => {
            this.logger.warn(
              'OAuth token call to Discord failed: ' +
                JSON.stringify(error.response.data),
            );
            if (error.response.data.error === 'invalid_grant') {
              this.logger.warn(
                'Is the user trying to log in not member of the guild?',
              );
            }
            throw new UnauthorizedException();
          }),
        ),
    );
    const { data } = await firstValueFrom(
      this.http
        .get<{
          id: string;
          username: string;
        }>('https://discordapp.com/api/users/@me', {
          headers: { Authorization: `Bearer ${response.data.access_token}` },
        })
        .pipe(
          catchError((error: AxiosError) => {
            throw `Error: ${error.message} `;
          }),
        ),
    );
    return this.validateUser(data);
  }
}
