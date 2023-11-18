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
import { ModerationModule } from './moderation/moderation.module';
import { SettingsModule } from './settings/settings.module';
import { AuditLogModule } from './auditlog/auditlog.module';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvVars: false,
    }),
    UserModule,
    JwtAuthModule,
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
    BotModule,
    TasksModule,
    TasksModule,
    ModerationModule,
    SettingsModule,
    AuditLogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
