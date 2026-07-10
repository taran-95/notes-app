import { Controller, Get, Render, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private authService: AuthService) {}

  @Get()
  @Render('index')
  async home(@Req() req: Request) {
    if (await this.authService.verifyToken(req.cookies.jwt)) {
      return {isLoggedIn: true};
    }
    return {isLoggedIn: false};
  }
}
