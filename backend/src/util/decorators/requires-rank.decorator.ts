import { SetMetadata } from '@nestjs/common';
import { Rank } from '@prisma/client';
/**
 * The constant used in the RequiredRank decorator to store the rank for a function/object
 */
export const REQUIRED_RANK_KEY = '__rank__';
/**
 * Sets the required rank for a route or controller
 * @param rank Rank that is required to access the route or controller. Lower ranks are automatically inherited
 */
export const RequiredRank = (rank: Rank) =>
  SetMetadata(REQUIRED_RANK_KEY, rank);
