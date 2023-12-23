import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma.service';
import { DiscordModule } from '@discord-nestjs/core';

@Module({
  imports: [DiscordModule.forFeature()],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
