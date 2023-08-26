import { PassportStrategy } from '@nestjs/passport';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AuthService } from './discord-auth.service';
import { Strategy, VerifyCallback } from 'passport-oauth2';
import { stringify } from 'querystring';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(
    private authService: AuthService,
    private http: HttpService,
    private configService: ConfigService,
  ) {
    super({
      authorizationURL: `https://discordapp.com/api/oauth2/authorize?${stringify(
        {
          client_id: configService.get('DISCORD_OAUTH_CLIENT_ID'),
          redirect_uri: configService.get('DISCORD_CALLBACK_URL'),
          response_type: 'code',
          scope: 'identify',
        },
      )}`,
      tokenURL: 'https://discordapp.com/api/oauth2/token',
      scope: 'identify',
      clientID: configService.get('DISCORD_OAUTH_CLIENT_ID'),
      clientSecret: configService.get('DISCORD_OAUTH_CLIENT_SECRET'),
      callbackURL: configService.get('DISCORD_CALLBACK_URL'),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Record<string, unknown>,
    done: VerifyCallback,
  ): Promise<any> {
    const { data } = await firstValueFrom(
      this.http
        .get<{
          id: string;
          username: string;
        }>('https://discordapp.com/api/users/@me', {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .pipe(
          catchError((error: AxiosError) => {
            throw `Error: ${error.message} `;
          }),
        ),
    );
    return done(null, this.authService.validateUser(data));
  }
}
