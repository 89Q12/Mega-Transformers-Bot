import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { REQUIRED_RANK_KEY } from '../decorators/requires-rank.decorator';
import { PrismaService } from 'src/prisma.service';
import { Rank } from '@prisma/client';

@Injectable()
export class HasRequiredRank implements CanActivate {
  private readonly logger = new Logger(HasRequiredRank.name);

  constructor(
    @Inject(Reflector)
    private reflector: Reflector,
    @Inject(PrismaService) private prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const requiredRanks = this.reflector.getAllAndOverride<Rank[]>(
      REQUIRED_RANK_KEY,
      [context.getHandler(), context.getClass()],
    );
    const req = context
      .switchToHttp()
      .getRequest<Request & { user: { userId: string } }>();
    const userId = req.user.userId;
    if (!userId) throw new UnauthorizedException();
    const user = await this.prismaService.guildUser.findUnique({
      where: { guildId_userId: { userId, guildId: req.params.guildId } },
    });
    if (!user) throw new ForbiddenException();
    if (!requiredRanks) {
      return true;
    }

    return requiredRanks.includes(user.rank);
  }
}
