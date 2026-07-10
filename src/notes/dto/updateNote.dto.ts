import { IsNotEmpty, IsString, IsOptional, IsArray, IsNumber } from "class-validator";

export class UpdateNoteDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    note: string;

    @IsOptional()
    @IsArray()
    tags: number[] = [];
}