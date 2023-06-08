import { Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(@Inject(PrismaService) private database: PrismaService) {}

  async findOne(userId: number): Promise<User | undefined> {
    return this.database.user.findUnique({
      where: {
        user_id: userId,
      },
    });
  }
  async findOneOrCreate(profile: {
    id: string;
    username: string;
  }): Promise<User | undefined> {
    const user = await this.database.user.findUnique({
      where: {
        user_id: parseInt(profile.id),
      },
    });
    if (!user) {
      return await this.database.user.create({
        data: {
          user_id: parseInt(profile.id),
          name: profile.username,
        },
      });
    }
    return user;
  }
}
