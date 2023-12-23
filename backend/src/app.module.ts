import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { JwtAuthModule } from './auth/jwt/jwt-auth.module';
import { DiscordModule } from '@discord-nestjs/core';
import { GatewayIntentBits, Partials } from 'discord.js';
import { BotModule } from './bot/bot.module';
import { TasksModule } from './tasks/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ModerationModule } from './guild/moderation/moderation.module';
import { SettingsModule } from './guild/settings/settings.module';
import { AuditLogModule } from './auditlog/auditlog.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GuildUserModule } from './guild/guild-user/guild-user.module';
import { GuildModule } from './guild/guild.module';
import { RouterModule } from '@nestjs/core';
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
            forGuild: configService.get('GUILD_ID'),
            removeCommandsBefore: false,
          },
        ],
        failOnLogin: true,
      }),
      inject: [ConfigService],
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
            module: SettingsModule,
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
    ModerationModule,
    SettingsModule,
    AuditLogModule,
    GuildUserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
