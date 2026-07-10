import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
    
    constructor(private prisma: PrismaService){}

    findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: {email},
        });
    }

    findById(id: number) {
        return this.prisma.user.findUnique({
            where: {id},
        });
    }

    create(email: string, password: string) {
        return this.prisma.user.create({
            data: {
                email: email,
                passwordHash: password,
            },
        });
    }
}
