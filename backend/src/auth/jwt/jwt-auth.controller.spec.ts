import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthController } from './jwt-auth.controller';
import { JwtAuthService } from './jwt-auth.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SelfService } from 'src/user/self.service';
import { INJECT_DISCORD_CLIENT } from '@discord-nestjs/core';
import { Client } from 'discord.js';
import { PrismaService } from 'src/prisma.service';

describe('JwtAuthController', () => {
  let controller: JwtAuthController;
  let httpsService: HttpService;
  let client: Client;
  beforeEach(async () => {
    httpsService = {} as HttpService;
    client = {} as Client;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JwtAuthController],
      providers: [
        JwtService,
        JwtAuthService,
        ConfigService,
        SelfService,
        PrismaService,
        { provide: HttpService, useValue: httpsService },
        { provide: INJECT_DISCORD_CLIENT, useValue: client },
      ],
    }).compile();

    controller = module.get<JwtAuthController>(JwtAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
