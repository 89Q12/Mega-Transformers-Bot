import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from '../prisma.service';
import { Request } from 'express';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt/guards/jwt-auth.guard';

@Injectable()
export class IsModGuard implements CanActivate {
  private readonly logger = new Logger(IsModGuard.name);

  constructor(private readonly prismaService: PrismaService) {}

  private static readonly ALLOWED_ROLES: readonly User['rank'][] = [
    'MOD',
    'ADMIN',
    'OWNER',
  ];

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const userId = (req.user as any)?.user?.user_id;
    if (!userId) {
      this.logger.warn(
        `The request has no user_id assigned. Please make sure the ${IsModGuard.name} is running after the ${JwtAuthGuard.name}`,
      );
      throw new InternalServerErrorException();
    }
    const requestUser = await this.prismaService.user.findUnique({
      where: { userId },
    });
    if (!requestUser) throw new UnauthorizedException();
    return IsModGuard.ALLOWED_ROLES.includes(requestUser.rank);
  }
}
