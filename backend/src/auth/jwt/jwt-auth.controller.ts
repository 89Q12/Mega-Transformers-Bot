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

    return this.authService.login(await this.authService.getUserFromCode(code));
  }
}
