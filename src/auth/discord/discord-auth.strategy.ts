import { PassportStrategy } from '@nestjs/passport';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AuthService } from './discord-auth.service';
import { Strategy, VerifyCallback } from 'passport-oauth2';
import { stringify } from 'querystring';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

// change these to be your Discord client ID and secret
const clientID = '664177028119003136';
const clientSecret = 'oOt-EkPEokxbaL7sQ3XH1kaojUXxjPm_';
const callbackURL = 'http://localhost:3000/auth/discord';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(private authService: AuthService, private http: HttpService) {
    super({
      authorizationURL: `https://discordapp.com/api/oauth2/authorize?${stringify(
        {
          client_id: clientID,
          redirect_uri: callbackURL,
          response_type: 'code',
          scope: 'identify',
        },
      )}`,
      tokenURL: 'https://discordapp.com/api/oauth2/token',
      scope: 'identify',
      clientID,
      clientSecret,
      callbackURL,
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
    console.log(accessToken, refreshToken, data);
    return done(null, this.authService.validateUser(data));
  }
}
