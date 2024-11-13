import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { SelfDto } from './self.dto';
import { RequestUser } from '../util/decorators/request-user.decorator';
import { JwtAuthGuard } from '../auth/jwt/guards/jwt-auth.guard';
import { SelfService } from './self.service';

/**
 * The controller for the /user/self endpoint.
 * This endpoint is responsible for telling the frontend the current logged in user.
 */
@Controller('/user/self')
@UseGuards(JwtAuthGuard)
export class SelfController {
  constructor(@Inject(SelfService) private readonly selfService: SelfService) {}
  /**
   * Gets the current logged in user for the frontend.
   * @param userId the user ID, this is the discord user ID and it comes from the request if a user is logged in
   * @returns the user with data fetch from the discord api, see self.service.ts
   */
  @Get()
  async getSelf(@RequestUser() userId: string): Promise<SelfDto> {
    return this.selfService.fetchSelf(userId);
  }
}
