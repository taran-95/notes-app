import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
//import { pool } from 'src/db';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TagsService {

    constructor(private readonly prisma: PrismaService){}

    async createTag(name: string, user) {
        if(!name) {
            throw new BadRequestException("Name can't be empty!");
        }
        const result = await this.prisma.tag.create({
            data: {
                name: name,
                userId: user,
            }
        });
        return {...result, id: result.id.toString()};
    }

    async updateTag(id: number, newName: string, user) {
        if(!newName) {
            throw new BadRequestException("Name can't be empty");
        }

        const result = await this.prisma.tag.update({
            where: {
                id: id,
                userId: user
            },
            data: {
                name: newName,
            }
        });

        if(!result){
            throw new NotFoundException(`Note ${id} not found!`);
        }
        return {...result, id:result.id.toString()};

    }

    async search(search: string, user) {
        try {
            const results = await this.prisma.tag.findMany({
                where: {
                    name: {
                        startsWith: search,
                        mode: 'insensitive'
                    },
                    userId: user,
                },
                orderBy: {
                    id: "desc"
                }
            });

             return results.map(tag => ({
                ...tag,
                id: Number(tag.id),
            }));
        } catch(error) {
            if (error instanceof Error)
                throw new Error(error.message);
        }
    }

    async deleteTag(id: number, user) {
        try{
            return await this.prisma.tag.delete({where: {id: id, userId: user}});
        } catch (error) {
            throw new Error("Can't Delete Tag");
        }
    }
}
