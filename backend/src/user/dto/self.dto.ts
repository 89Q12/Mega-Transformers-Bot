import { User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class SelfDto {
  @ApiProperty({ type: String }) userId: User['userId'];
  @ApiProperty({ type: String }) guildId: User['guildId'];
  @ApiProperty({ type: String }) name: User['name'];
  @ApiProperty({ type: String }) rank: User['rank'];
  @ApiProperty({ type: String }) avatarUrl: string;
}
