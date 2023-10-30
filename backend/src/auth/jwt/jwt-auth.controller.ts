import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthService } from './jwt-auth.service';
import { RefreshJwtGuard } from './guards/refresh-auth.guard';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { OAuthErrorData } from 'discord.js';

@Controller('auth')
@ApiTags('auth/jwt')
@ApiBearerAuth()
export class JwtAuthController {
  private readonly logger = new Logger(JwtAuthController.name);

  constructor(
    private authService: JwtAuthService,
    private http: HttpService,
    private configService: ConfigService,
  ) {}

  @UseGuards(RefreshJwtGuard)
  @ApiHeader({
    name: 'refresh_token',
    description: '<refresh_token>',
  })
  @Post('refresh')
  async refreshToken(@Req() req) {
    return this.authService.refreshToken(req.user);
  }

  @Get('login')
  async login(@Query('code') code: string) {
    if (!code) {
      throw new BadRequestException('No code provided');
    }
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
    return this.authService.login(await this.authService.validateUser(data));
  }
}
