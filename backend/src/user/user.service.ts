import { Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(@Inject(PrismaService) private database: PrismaService) {}

  async findOneUser(userId: string): Promise<User | undefined> {
    return this.database.user.findUnique({
      where: { userId },
    });
  }

  async upsert(userId: string): Promise<User> {
    return this.database.user.upsert({
      where: { userId },
      create: { userId },
      update: { userId },
    });
  }
}
