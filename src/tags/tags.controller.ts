import { Controller, Get, Post, Delete, Param, Query, ParseIntPipe, Patch, UseGuards, Req } from '@nestjs/common';
import { TagsService } from './tags.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';

@Controller('tags')
@UseGuards(JwtAuthGuard)
export class TagsController {
    constructor(private tagsService: TagsService){}

    @Post(':name')
    createTag(@Param("name") name: string, @Req() req: AuthenticatedRequest) {
        return this.tagsService.createTag(name, req.user.id);
    }

    @Patch(':id')
    updateTag(@Param("id", ParseIntPipe) id: number, @Query('newName') newName: string, @Req() req: AuthenticatedRequest) {
        return this.tagsService.updateTag(id, newName, req.user.id);
    }

    @Get('search')
    search(@Query("search") search: string, @Req() req: AuthenticatedRequest) {
        try{
            return this.tagsService.search(search, req.user.id);
        } catch(error) {
            if(error instanceof Error) {
                throw new Error(error.message);
            }
        }
    }

    @Delete(':id')
    async deleteTag(@Param("id", ParseIntPipe) id: number, @Req() req: AuthenticatedRequest) {
        try {
            if(await this.tagsService.deleteTag(id, req.user.id))
                return "deleted succesufllly!"
        } catch(error){
            if(error instanceof Error){
                throw new Error(error.message)
            }
        }
    }
}
