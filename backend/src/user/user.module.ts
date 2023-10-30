import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma.service';
import { UserController } from './user.controller';
import { DiscordModule } from '@discord-nestjs/core';

@Module({
  imports: [DiscordModule.forFeature()],
  providers: [UserService, PrismaService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
