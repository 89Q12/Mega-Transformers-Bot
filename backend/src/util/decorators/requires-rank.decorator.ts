import { SetMetadata } from '@nestjs/common';
import { Rank } from '@prisma/client';
export const REQUIRED_RANK_KEY = '__rank__';
/**
 * Sets the required rank(s) for a route or controller
 * @param ranks Rank(s) that are required to access the route or controller
 */
export const RequiredRank = (...ranks: Array<Rank>) =>
  SetMetadata(REQUIRED_RANK_KEY, ranks);
