import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/discord/discord-auth.module';
import { JwtAuthModule } from './auth/jwt/jwt-auth.module';

@Module({
  imports: [AuthModule, UsersModule, JwtAuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
