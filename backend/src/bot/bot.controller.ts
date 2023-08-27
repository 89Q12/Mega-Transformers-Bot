import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/guards/jwt-auth.guard';

/*
  Bot API, this allows the frontend to interact with the discord api
*/
@Controller('bot')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BotController {}
