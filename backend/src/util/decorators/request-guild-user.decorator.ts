import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../auth/jwt/guards/jwt-auth.guard';
import { GuildUser } from '@prisma/client';

const logger = new Logger('RequestGuildUser');
/**
 * A param decorator to check whether a GuildUser is set on a request,
 * if not the route is not guarded by JWT but should be.
 * If the route is guarded it returns the user
 */
export const RequestGuildUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: GuildUser }>();
    const user = request.user;

    if (!user) {
      logger.error(`${ctx.getHandler().toString()} has a parameter with
      annotation RequestGuildUser but is NOT guarded by ${
        JwtAuthGuard.name
      } AND the request path ${
        request.path
      } is not prefixed by "/guild/:guildId/
        Please use ${JwtAuthGuard.name} if you want to access a UserId`);
      throw new InternalServerErrorException();
    }
    return user;
  },
);
