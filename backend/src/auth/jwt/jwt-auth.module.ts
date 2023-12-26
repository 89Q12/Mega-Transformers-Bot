import { Module } from '@nestjs/common';
import { JwtAuthService } from './jwt-auth.service';
import { JwtAuthStrategy } from './jwt-auth.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthController } from './jwt-auth.controller';
import { RefreshJwtStrategy } from './refresh-token.strategy';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    PassportModule,
    HttpModule,
    JwtModule.register({
      secret: 'jwtConstants.secret',
      signOptions: { expiresIn: '900s' },
    }),
  ],
  controllers: [JwtAuthController],
  providers: [
    JwtAuthStrategy,
    RefreshJwtStrategy,
    JwtAuthService,
    PrismaService,
    UserService,
  ],
  exports: [JwtAuthService],
})
export class JwtAuthModule {}
