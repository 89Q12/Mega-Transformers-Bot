import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from './discord-auth.service';
import { UsersModule } from '../../users/users.module';
import { AuthController } from './discord-auth.controller';
import { DiscordStrategy } from './discord-auth.strategy';
import { JwtAuthModule } from '../jwt/jwt-auth.module';

@Module({
  imports: [UsersModule, HttpModule, JwtAuthModule],
  providers: [AuthService, DiscordStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
