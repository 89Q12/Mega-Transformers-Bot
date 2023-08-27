import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthService } from './jwt-auth.service';
import { RefreshJwtGuard } from './guards/refresh-auth.guard';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth/jwt')
@ApiBearerAuth()
export class JwtAuthController {
  constructor(private authService: JwtAuthService) {}
  @UseGuards(RefreshJwtGuard)
  @ApiHeader({
    name: 'refresh_token',
    description: '<refresh_token>',
  })
  @Post('refresh')
  async refreshToken(@Req() req) {
    return this.authService.refreshToken(req.user);
  }
}
