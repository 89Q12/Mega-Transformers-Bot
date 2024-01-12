import { MiddlewareConsumer, Module, Req } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { JwtAuthModule } from './auth/jwt/jwt-auth.module';
import { DiscordModule } from '@discord-nestjs/core';
import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { BotModule } from './bot/bot.module';
import { TasksModule } from './tasks/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ModerationModule } from './guild/moderation/moderation.module';
import { GuildSettingsModule } from './guild/guild-settings/guild-settings.module';
import { AuditLogModule } from './auditlog/auditlog.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GuildUserModule } from './guild/guild-user/guild-user.module';
import { GuildModule } from './guild/guild.module';
import { RouterModule } from '@nestjs/core';
import { PrismaService } from './prisma.service';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvVars: false,
    }),
    DiscordModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        token: configService.get('TOKEN'),
        discordClientOptions: {
          intents: [
            GatewayIntentBits.AutoModerationConfiguration,
            GatewayIntentBits.AutoModerationExecution,
            GatewayIntentBits.GuildPresences,
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildModeration,
            GatewayIntentBits.GuildInvites,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildMessageTyping,
            GatewayIntentBits.GuildWebhooks,
            GatewayIntentBits.GuildIntegrations,
            GatewayIntentBits.GuildMessageTyping,
            GatewayIntentBits.GuildEmojisAndStickers,
            GatewayIntentBits.DirectMessageTyping,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.DirectMessageReactions,
          ],
          partials: [
            Partials.GuildMember,
            Partials.ThreadMember,
            Partials.User,
            Partials.Message,
            Partials.Channel,
            Partials.Reaction,
            Partials.GuildScheduledEvent,
          ],
        },

        registerCommandOptions: [
          {
            removeCommandsBefore: true,
          },
        ],

        failOnLogin: true,
      }),
      inject: [ConfigService],
      setupClientFactory: (client: Client) => {
        client.setMaxListeners(30);
      },
    }),
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
    RouterModule.register([
      {
        path: 'guild/:guildId',
        children: [
          {
            path: '/',
            module: GuildModule,
          },
          {
            path: '/auditlog',
            module: AuditLogModule,
          },
          {
            path: '/user',
            module: GuildUserModule,
          },
          {
            path: '/settings',
            module: GuildSettingsModule,
          },
          {
            path: '/moderation',
            module: ModerationModule,
          },
        ],
      },
    ]),
    UserModule,
    JwtAuthModule,
    GuildModule,
    BotModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
