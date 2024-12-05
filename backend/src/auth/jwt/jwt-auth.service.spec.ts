import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthService } from './jwt-auth.service';
import { JwtService } from '@nestjs/jwt';
import { SelfService } from 'src/user/self.service';
import { ConfigService } from '@nestjs/config';
import { INJECT_DISCORD_CLIENT } from '@discord-nestjs/core';
import { HttpService } from '@nestjs/axios';
import { Client } from 'discord.js';
import { PrismaService } from 'src/prisma.service';

describe('JwtAuthService', () => {
  let service: JwtAuthService;
  let httpsService: HttpService;
  let client: Client;

  beforeEach(async () => {
    httpsService = {} as HttpService;
    client = {} as Client;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthService,
        JwtService,
        ConfigService,
        SelfService,
        { provide: HttpService, useValue: httpsService },
        { provide: INJECT_DISCORD_CLIENT, useValue: client },
        PrismaService,
      ],
    }).compile();

    service = module.get<JwtAuthService>(JwtAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
