import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private usersService: UsersService, private authService: AuthService){}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const token = request.cookies.jwt;

    if(!token){
      response.clearCookie("jwt");
      response.redirect("/auth/login");
      return false;
    }

    try{
      const payload = await this.jwtService.verifyAsync(token);
      const user = await this.usersService.findById(payload.sub);
      
      if(!user) {
        response.clearCookie("jwt");
        response.redirect("/auth/login");
        return false;
      }
      
      request.user = {id: user.id};
      return true;
    } catch(error) {
        response.clearCookie("jwt");
        response.redirect("/auth/login");
        return false;
    }
  }
}
