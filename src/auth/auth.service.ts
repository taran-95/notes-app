import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { compare, hash } from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {

    constructor(private usersService: UsersService, private jwtService: JwtService){}

    async register(dto: RegisterDto) {
        const existing = await this.usersService.findByEmail(dto.email);

        if (existing) {
            throw new BadRequestException("Email already exists");
        }

        const hashedPassword = await hash(dto.password, 10);

        const user = await this.usersService.create(dto.email, hashedPassword);

        const token = await this.createToken(user);
        return token;
    }

    async login(dto: LoginDto) {
        const user = await this.usersService.findByEmail(dto.email);
        if(!user) {
            throw new UnauthorizedException("Invalid Email or Password");
        }

        const valid = await compare(dto.password, user.passwordHash);
        if(!valid) {
            throw new UnauthorizedException("Invalid Email or Password");
        }

        const token = await this.createToken(user);
        return token;
    }

    async verifyToken(token?: string): Promise<boolean> {
        if(!token)
            return false

        try{
            const payload = await this.jwtService.verifyAsync(token);
            const user = await this.usersService.findById(payload.sub);
            
            if(!user)
                return false

            return true;
        } catch {
            return false;
        }
    }

    private createToken(user) {
        return this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
        });
    }
}
