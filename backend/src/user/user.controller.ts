import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Injectable,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequestUser } from '../decorators/request-user.decorator';
import { InjectDiscordClient } from '@discord-nestjs/core';
import { Client } from 'discord.js';
import { SelfDto } from './dto/self.dto';
import { plainToInstance } from '../util/plain-to-instance';

@Injectable()
@ApiTags('user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @InjectDiscordClient() private readonly client: Client,
  ) {}

  @Get('self')
  async getSelf(@RequestUser() userId: string): Promise<SelfDto> {
    const [{ rank, guildId, name }, avatarUrl] = await Promise.all([
      this.userService.findOne(userId),
      this.client.users.fetch(userId).then((it) => it.avatarURL({ size: 128 })),
    ]);
    return plainToInstance(SelfDto, {
      userId,
      rank,
      guildId,
      name,
      avatarUrl,
    });
  }
}
