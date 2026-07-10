import { Controller, Post, Get, Patch, Req, Body, Param, ParseIntPipe, ValidationPipe, Delete, Query, Render, Redirect, UseGuards } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/createNote.dto';
import { UpdateNoteDto } from './dto/updateNote.dto';
import { GetNoteDto } from './dto/getNote.dto';
import { UpdateNoteTagDto } from './dto/updateNoteTag.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
    constructor(private notesService: NotesService){}
    
    @Get()
    @Render('notes/viewNotes')
    async getNotes(@Query() query: GetNoteDto, @Req() req: AuthenticatedRequest) {
        const notes = await this.notesService.getNotes(query, req.user.id);
        return {notes};
    }

    @Get('edit/:id')
    @Render('notes/edit')
    async editNote(@Param('id', ParseIntPipe) id: number, @Req() req: AuthenticatedRequest) {
        const note = await this.notesService.getNote(id, req.user.id);
        return {note};
    }

    @Get('create')
    @Render('notes/createNote')
    async getCreateNote() {
        return {message: "Page Loaded Successfully"}
    }

    @Post()
    async createNote(@Body() note: CreateNoteDto, @Req() req: AuthenticatedRequest) {
        await this.notesService.createNote(note, req.user.id);
    }

    @Get(':id')
    @Render('notes/viewNote')
    async getNote(@Param("id", ParseIntPipe) id: number, @Req() req: AuthenticatedRequest) {
        const note = await this.notesService.getNote(id, req.user.id);
        return {note};
    }

    @Patch(':id')
    async updateNote(@Param("id", ParseIntPipe) id: number, @Body() updatedNote: UpdateNoteDto, @Req() req: AuthenticatedRequest) {
        await this.notesService.updateNote(id, updatedNote, req.user.id);
    }

    @Post('delete/:id')
    @Redirect('/notes', 302)
    async deleteNote(@Param("id", ParseIntPipe) id: number, @Req() req: AuthenticatedRequest) {
        try {
            await this.notesService.deleteNote(id, req.user.id);
        } catch (error) {
            if(error instanceof Error){
                throw new Error(error.message);
            }
        }
    }

}
