import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma.service';
import { PrismaClient, Rank, Stats, User } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

describe('UserService', () => {
  let service: UserService;
  let prisma: DeepMockProxy<PrismaClient>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, UserService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<DeepMockProxy<PrismaClient>>(PrismaService);
    jest.useFakeTimers().setSystemTime(new Date());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should return an array of users', async () => {
    const result = [
      {
        userId: '322822954796974080',
        name: 'John Doe',
        guildId: '616609333832187924',
        rank: Rank.MEMBER,
        unlocked: false,
        deactivated: false,
      },
    ];

    //@ts-expect-error - PrismaClient is mocked
    prisma.user.findMany.mockResolvedValueOnce(result);
    expect(await service.findAll(result[0].guildId)).toEqual(result);
    expect(prisma.user.findMany).toBeCalledWith({
      where: { guildId: result[0].guildId },
    });
  });
  it('should return a user', async () => {
    const result = {
      userId: '322822954796974080',
      name: 'John Doe',
      guildId: '616609333832187924',
      rank: Rank.MEMBER,
      unlocked: false,
      deactivated: false,
    };
    prisma.user.findUnique.mockResolvedValue(result);
    expect(await service.findOne(result.userId)).toEqual(result);
    expect(prisma.user.findUnique).toBeCalledWith({
      where: { userId: result.userId },
    });
  });
  it('should find or create a user', async () => {
    const result = {
      userId: '322822954796974080',
      name: 'John Doe',
      guildId: '616609333832187924',
      rank: Rank.MEMBER,
      unlocked: false,
      deactivated: false,
    };
    prisma.user.create.mockResolvedValue(result);
    //@ts-expect-error - PrismaClient is mocked
    prisma.stats.create.mockImplementation();
    expect(
      await service.findOrCreate(
        result.userId,
        result.name,
        result.guildId,
        result.rank,
      ),
    ).toEqual(result);
    expect(prisma.user.create).toBeCalledWith({
      data: {
        userId: result.userId,
        name: result.name,
        guildId: result.guildId,
        rank: result.rank,
      },
    });
    expect(prisma.stats.create).toBeCalledWith({
      data: { userId: result.userId, guildId: result.guildId },
    });
  });
  it('should delete a user', async () => {
    prisma.user.delete.mockImplementation();
    prisma.stats.delete.mockImplementation();
    const userId = '616609333832187924';
    await service.deleteOne(userId);
    expect(prisma.user.delete).toBeCalledWith({ where: { userId } });
    expect(prisma.stats.delete).toBeCalledWith({ where: { userId } });
  });

  it('should unlock a user', async () => {
    prisma.user.update.mockImplementation();
    service.findOne = jest.fn().mockImplementation(() =>
      Promise.resolve({
        userId: '322822954796974080',
        name: 'John Doe',
        guildId: '616609333832187924',
        rank: Rank.MEMBER,
        unlocked: false,
        deactivated: false,
      }),
    );
    const userId = '322822954796974080';
    await service.unlockUser(userId);
    expect(prisma.user.update).toBeCalledWith({
      where: { userId: userId },
      data: { unlocked: true, rank: 'MEMBER' },
    });
  });
  it('should set a rank', async () => {
    prisma.user.update.mockImplementation();
    service.findOne = jest.fn().mockImplementation(() =>
      Promise.resolve({
        userId: '322822954796974080',
        name: 'John Doe',
        guildId: '616609333832187924',
        rank: Rank.MEMBER,
        unlocked: false,
        deactivated: false,
      }),
    );
    const userId = '322822954796974080';
    await service.setRank(userId, 'MEMBER');
    expect(prisma.user.update).toBeCalledWith({
      where: { userId: userId },
      data: { rank: 'MEMBER' },
    });
  });
  it('should set a first message id', async () => {
    prisma.stats.update.mockImplementation();
    service.findOne = jest.fn().mockImplementation(() =>
      Promise.resolve({
        userId: '322822954796974080',
        name: 'John Doe',
        guildId: '616609333832187924',
        rank: Rank.MEMBER,
        unlocked: false,
        deactivated: false,
      }),
    );
    const userId = '322822954796974080';
    const messageId = '123456789';
    await service.setFirstMessageId(messageId, userId);
    expect(prisma.stats.update).toBeCalledWith({
      where: { userId: userId },
      data: { firstMessageId: messageId },
    });
  });
  it('should insert a message', async () => {
    //@ts-expect-error - PrismaClient is mocked
    prisma.message.create.mockImplementation();
    service.findOne = jest.fn().mockImplementation(() =>
      Promise.resolve({
        userId: '322822954796974080',
        name: 'John Doe',
        guildId: '616609333832187924',
        rank: Rank.MEMBER,
        unlocked: false,
        deactivated: false,
      }),
    );
    const userId = '322822954796974080';
    const messageId = '123456789';
    const channelId = '123456789';
    const guildId = '123456789';
    await service.insertMessage(userId, messageId, channelId, guildId);
    expect(prisma.message.create).toBeCalledWith({
      data: {
        userId,
        messageId,
        channelId,
        guildId,
        createdAt: new Date(),
      },
    });
  });
  it('should return stats', async () => {
    const userId = '322822954796974080';
    prisma.stats.findUnique.mockImplementation();
    await service.getStats(userId);
    expect(prisma.stats.findUnique).toBeCalledWith({
      where: { userId: userId },
    });
  });
  it('should return false if the user is inactive', async () => {
    const user = {
      userId: '322822954796974080',
      name: 'John Doe',
      guildId: '616609333832187924',
      rank: Rank.MEMBER,
      unlocked: false,
      deactivated: false,
    } as User;
    prisma.stats.findUnique.mockResolvedValueOnce({
      userId: '322822954796974080',
      guildId: '616609333832187924',
      user,
      messages: [],
      lastMessageSent: new Date(),
      lastOnline: new Date(),
      messageCountBucket: 10,
      firstMessageId: '123456789',
    } as Stats);
    expect(await service.isActive(user)).toBe(false);
  });
  it('should return true if the user is inactive', async () => {
    const user = {
      userId: '322822954796974080',
      name: 'John Doe',
      guildId: '616609333832187924',
      rank: Rank.MEMBER,
      unlocked: false,
      deactivated: false,
    } as User;
    prisma.stats.findUnique.mockResolvedValueOnce({
      userId: '322822954796974080',
      guildId: '616609333832187924',
      user,
      messages: [],
      lastMessageSent: new Date(),
      lastOnline: new Date(),
      messageCountBucket: 33,
      firstMessageId: '123456789',
    } as Stats);
    expect(await service.isActive(user)).toBe(true);
  });
});
