import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/createNote.dto'
import { UpdateNoteDto } from './dto/updateNote.dto';
//import { pool } from 'src/db';
import { GetNoteDto } from './dto/getNote.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateNoteTagDto } from './dto/updateNoteTag.dto';
import { connect } from 'http2';
import { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';

@Injectable()
export class NotesService {

    constructor(private readonly prisma: PrismaService) {}

    async getNotes(query: GetNoteDto, user) {
        //Sort Query Validation  (Not needed, class validators handle it by using IsIn)
        const { sortby = 'updated_at', order = 'desc' } = query;
        const allowedSortFields = ['created_at', 'updated_at', 'title'];
        const sortField = allowedSortFields.includes(sortby) ? sortby : "updated_at";
        const orderField = "asc" === order ? "asc" : "desc"

        const results = await this.prisma.note.findMany({
            where: query.search?{
                title: {
                    startsWith: query.search,
                    mode: 'insensitive',
                },
                userId: user
            }: {userId: user},

            orderBy: {
                [sortField]: orderField
            },

            skip: query.limit ? (query.page * query.results):0,
            take: query.limit ? (query.results):undefined,

            include: {
                tags: {
                    include: {tag: true}
                }
            }
        });

        return results.map(note => ({
            ...note,
            id: Number(note.id),
        }));

    }
    
    async getNote(id: number, user) {
        
        const result = await this.prisma.note.findUnique({
            where: {
                id,
                userId: user
            },
            include: {
                tags: {
                    include: {tag: true}
                }
            }
        });
        if (!result) {
            throw new NotFoundException(`Note ${id} not found!`);
        }
        return {...result, id: result.id.toString()}
    }
    
    async createNote(note: CreateNoteDto, user) {
        const result = await this.prisma.note.create({
            data: {
                title: note.title,
                note: note.note,
                userId: user
            }
        });

        const tags = await this.prisma.tag.findMany({
            where: {
                id: {
                    in: note.tags
                },
                userId: user
            }
        });

        await this.prisma.note_Tag.createMany({
            data: tags.map((tag) => ({
                note_id: result.id,
                tag_id: tag.id
            }))
        });
        
        return {...result, id: result.id.toString()};
    }


    async updateNote(id: number, updatedNote: UpdateNoteDto, user) {
        await this.prisma.note_Tag.deleteMany({
            where: {
                note_id: id
            }
        });

        const tags = await this.prisma.tag.findMany({
            where: {
                id: {
                    in: updatedNote.tags
                },
                userId: user
            }
        });

        await this.prisma.note_Tag.createMany({
            data: tags.map(tag => ({
                note_id: id,
                tag_id: tag.id
            }))
        });

        const result = await this.prisma.note.update({
            where: {
                id: id,
                userId: user
            },
            data: {
                title: updatedNote.title,
                note: updatedNote.note
            }
        });

        return {...result, id:result.id.toString()};
    }

    async deleteNote(id: number, user) {
        try {
            return await this.prisma.note.delete({
                where: {
                    id: id,
                    userId: user
                },
            }); 
        } catch (error) {
            console.log(error);
        };
    }

}
