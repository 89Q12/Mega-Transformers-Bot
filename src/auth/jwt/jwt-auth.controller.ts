import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthService } from './jwt-auth.service';
import { RefreshJwtGuard } from './guards/refresh-auth.guard';

@Controller('auth')
export class JwtAuthController {
  constructor(private authService: JwtAuthService) {}
  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@Req() req) {
    return this.authService.refreshToken(req.user);
  }
}
