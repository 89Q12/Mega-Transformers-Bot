import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GuildUser, User } from '@prisma/client';
import { Request } from 'express';
import { Observable, lastValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(@Inject(PrismaService) private database: PrismaService) {
    super();
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    let isValidToken: boolean;
    try {
      const jwtValue = super.canActivate(context);
      isValidToken = (
        typeof jwtValue === 'boolean' || jwtValue instanceof Promise
          ? jwtValue instanceof Promise
            ? jwtValue.then((it) => it as boolean)
            : (jwtValue as boolean)
          : lastValueFrom(jwtValue).then((it) => it)
      ) as boolean;
    } catch (error) {
      isValidToken = false;
    }
    if (!isValidToken) return isValidToken;
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: { userId: string } | User | GuildUser }>();
    const userId = request.user.userId;
    const guildId = request.params['guildId'];
    if (!userId) {
      return false;
    }
    if (!guildId) {
      return this.database.user
        .findUnique({
          where: {
            userId,
          },
        })
        .then((user) => {
          if (!user) {
            request.user = user;
            return true;
          } else {
            return false;
          }
        });
    } else {
      return this.database.guildUser
        .findUnique({
          where: {
            guildId_userId: {
              guildId,
              userId,
            },
          },
        })
        .then((guildUser) => {
          if (!guildUser) {
            request.user = guildUser;
            return true;
          } else {
            return false;
          }
        });
    }
  }
}
