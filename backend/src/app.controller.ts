import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AppController {}
