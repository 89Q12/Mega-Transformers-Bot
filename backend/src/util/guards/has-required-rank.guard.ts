import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { GuildUser, Rank } from '@prisma/client';
import { Reflector } from '@nestjs/core';
import { REQUIRED_RANK_KEY } from '../decorators/requires-rank.decorator';

@Injectable()
export class HasRequiredRank implements CanActivate {
  private readonly logger = new Logger(HasRequiredRank.name);

  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const requiredRanks = this.reflector.getAllAndOverride<Rank[]>(
      REQUIRED_RANK_KEY,
      [context.getHandler(), context.getClass()],
    );
    const user = context.switchToHttp().getRequest<Request>().user as GuildUser;
    if (!user) throw new ForbiddenException();
    if (!requiredRanks) {
      return true;
    }

    return requiredRanks.includes(user.rank);
  }
}
