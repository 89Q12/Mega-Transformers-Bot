import { Module } from '@nestjs/common';
import { JwtAuthService } from './jwt-auth.service';
import { JwtAuthStrategy } from './jwt-auth.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthController } from './jwt-auth.controller';
import { RefreshJwtStrategy } from './refresh-token.strategy';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/users/user.module';
import { SettingsModule } from 'src/settings/settings.module';

@Module({
  imports: [
    PassportModule,
    UserModule,
    HttpModule,
    ConfigModule,
    SettingsModule,
    JwtModule.register({
      secret: 'jwtConstants.secret',
      signOptions: { expiresIn: '900s' },
    }),
  ],
  controllers: [JwtAuthController],
  providers: [JwtAuthStrategy, RefreshJwtStrategy, JwtAuthService],
  exports: [JwtAuthService],
})
export class JwtAuthModule {}
