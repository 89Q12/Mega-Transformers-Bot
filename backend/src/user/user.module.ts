import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma.service';
import { DiscordModule } from '@discord-nestjs/core';
import { SelfController } from './self.controller';
import { SelfService } from './self.service';

@Module({
  imports: [DiscordModule.forFeature()],
  providers: [UserService, PrismaService, SelfService],
  controllers: [SelfController],
  exports: [UserService],
})
export class UserModule {}
