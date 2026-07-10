import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg' 
import { PrismaClient } from 'generated/prisma/client';
import "dotenv/config";

@Injectable()
export class PrismaService extends PrismaClient {
    
    //private connectionString = `${process.env.DATABASE_URL}`;
    //private adapter = new PrismaPg(this.connectionString);

    constructor() {
        super({adapter: new PrismaPg(`${process.env.DATABASE_URL}`)})
    }
}
