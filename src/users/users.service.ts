import { Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { retry } from 'rxjs';
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
  async createOne(id: number, name: string): Promise<User> {
    const user = this.findOne(id);
    return user
      ? user
      : await this.database.user.create({
          data: {
            user_id: id,
            name,
          },
        });
  }
  async incrementMessagePoints(value: number, user_id: number) {
    value += (await this.findOne(user_id)).message_points;
    this.database.user.update({
      where: {
        user_id,
      },
      data: {
        message_points: value,
      },
    });
  }
  async decrementMessagePoints(value: number, user_id: number) {
    value -= (await this.findOne(user_id)).message_points;
    this.database.user.update({
      where: {
        user_id,
      },
      data: {
        message_points: value,
      },
    });
  }
  async deleteOne(user_id: number): Promise<void> {
    this.database.user.delete({
      where: {
        user_id,
      },
    });
  }
  async findAll(): Promise<Array<User>> {
    return this.database.user.findMany();
  }

  async updateMessageCountBucket(user: User): Promise<void> {
    this.database;
  }
  async isActive(user: User): Promise<boolean> {
    return false;
  }
}
