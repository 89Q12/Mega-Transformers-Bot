import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../auth/jwt/guards/jwt-auth.guard';
import { User } from '@prisma/client';

const logger = new Logger('RequestUser');

export const RequestUser = createParamDecorator<string>(
  (data: unknown, ctx: ExecutionContext) => {
    const userId = ctx.switchToHttp().getRequest<Request & { user: User }>()
      .user.userId;

    if (!userId) {
      logger.error(`${ctx.getHandler().toString()} has a parameter with
    annotation RequestUser but is NOT guarded by ${JwtAuthGuard.name}.
      Please use ${JwtAuthGuard.name} if you want to access a UserId`);
      throw new InternalServerErrorException();
    }
    return userId;
  },
);
