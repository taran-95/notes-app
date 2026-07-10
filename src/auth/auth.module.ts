import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import "dotenv/config";
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';


@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: "1d",
      }
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
  exports: [JwtAuthGuard, JwtModule, UsersModule, AuthService],
})
export class AuthModule {}
