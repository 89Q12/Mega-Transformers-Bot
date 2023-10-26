import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Injectable,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Injectable()
@ApiTags('user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(@Inject(UserService) private userService: UserService) {}

  @Get('self')
  async getSelf(@Req() req) {
    const { user } = req.user;
    if (!user) {
      return new BadRequestException('User not found');
    }
    return await this.userService.findOne(user.user_id);
  }
}
