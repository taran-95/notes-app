import { Body, Controller, Post, Get, Render, Res, Req, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Response, Request } from 'express';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import "dotenv/config";

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}

    @Get('register')
    async getRegisterPage(@Req() req: Request, @Res()res: Response) {
        if (await this.authService.verifyToken(req.cookies.jwt))
            return res.redirect('/notes');
        else
            return res.render('auth/register', { message: "Page Loaded" });
    }

    @Get('login')
    async getLoginPage(@Req() req: Request, @Res() res: Response) {
        if (await this.authService.verifyToken(req.cookies.jwt))
            return res.redirect('/notes');
        else
            return res.render('auth/login', { message: "Page Loaded" });
    }

    @Post('register')
    async register(@Body() dto: RegisterDto, @Res({passthrough:true}) res: Response) {
        try {
            const token = await this.authService.register(dto);

            res.cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: "lax",
                maxAge: 7 * 24* 60 * 60 * 1000,
            });
        } catch(error) {
            if (error instanceof BadRequestException)
                throw new BadRequestException(error.message);
        }
    }

    @Post('login') 
    async login(@Body() dto: LoginDto, @Res({passthrough:true}) res: Response) {
        try {
            const token = await this.authService.login(dto);
            
            res.cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: "lax",
                maxAge: 7 * 24* 60 * 60 * 1000,
            });
        } catch(error) {
            if(error instanceof UnauthorizedException) {
                throw new UnauthorizedException(error.message);
            }
        }
    }

    @Post("logout")
    async logout(@Res({passthrough: true}) res: Response) {
        res.clearCookie("jwt");
        return res.redirect("/auth/login");
    }

}
