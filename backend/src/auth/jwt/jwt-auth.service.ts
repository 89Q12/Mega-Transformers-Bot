import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AxiosError } from 'axios';
import { OAuthErrorData } from 'discord.js';
import { firstValueFrom, catchError } from 'rxjs';
import { SelfService } from 'src/user/self.service';

@Injectable()
export class JwtAuthService {
  private readonly logger = new Logger(JwtAuthService.name);

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly usersService: SelfService,
    private http: HttpService,
  ) {}

  async login(userId: string) {
    const payload = {
      sub: {
        userId,
      },
    };
    return {
      user: {
        user_id: userId,
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

  async refreshToken(userId: string) {
    const payload = {
      sub: {
        userId,
      },
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async validateUser(userId: string): Promise<string> {
    const user = await this.usersService.fetchSelf(userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user.userId;
  }

  async getUserFromCode(code: string): Promise<string> {
    const response = await firstValueFrom(
      this.http
        .post(
          'https://discordapp.com/api/oauth2/token',
          new URLSearchParams({
            client_id: this.configService.get('DISCORD_OAUTH_CLIENT_ID'),
            client_secret: this.configService.get('DISCORD_OAUTH_SECRET'),
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: this.configService.get('DISCORD_CALLBACK_URL'),
            scope: 'identify',
          }),
          {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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
    return this.validateUser(data.id);
  }
}
