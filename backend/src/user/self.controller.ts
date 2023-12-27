import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { SelfDto } from './self.dto';
import { RequestUser } from '../util/decorators/request-user.decorator';
import { JwtAuthGuard } from '../auth/jwt/guards/jwt-auth.guard';
import { SelfService } from './self.service';

@Controller('/user/self')
@UseGuards(JwtAuthGuard)
export class SelfController {
  constructor(@Inject(SelfService) private readonly selfService: SelfService) {}

  @Get()
  async getSelf(@RequestUser() userId: string): Promise<SelfDto> {
    return this.selfService.fetchSelf(userId);
  }
}
