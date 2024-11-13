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

/**
 * This guard can be used to guard routes/controller(HTTP ONLY NOT COMMANDS) with specific RANK(s)
 */
@Injectable()
export class HasRequiredRank implements CanActivate {
  private readonly logger = new Logger(HasRequiredRank.name);

  constructor(
    @Inject(Reflector)
    private reflector: Reflector,
    @Inject(PrismaService) private prismaService: PrismaService,
  ) {}
  /**
   * Function to check if the current user has the required rank to perform the current action.
   * @param context ExecutionContext see nestjs documentation
   * @returns boolean
   */
  async canActivate(context: ExecutionContext) {
    const requiredRank = this.reflector.getAllAndOverride<Rank>(
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
    if (!requiredRank) {
      return true;
    }

    const ownedRanks = [user.rank, ...InheritedRanks[user.rank]];
    return ownedRanks.includes(requiredRank);
  }
}

/**
 * Map of ranks that are inherited by any given rank,
 * meaning their lower ranks e.g MOD has MEMBER.
 * But MEMBER has 0 since its the lowest rank a member can have.
 */
const InheritedRanks: Record<Rank, Rank[]> = {
  OWNER: ['ADMIN', 'MOD', 'MEMBER'],
  ADMIN: ['MOD', 'MEMBER'],
  MOD: ['MEMBER'],
  MEMBER: [],
  NEW: [],
};
