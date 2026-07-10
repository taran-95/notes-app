import { IsNotEmpty, IsString, IsOptional, IsArray } from "class-validator";

export class UpdateNoteTagDto {
    @IsOptional()
    @IsArray()
    new_tags?: string[] = []

    @IsOptional()
    @IsArray()
    tag_ids?: number[] = []
}