import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator' 

export class CreateNoteDto {
    
    @IsString()
    @IsNotEmpty()
    title: string
    
    @IsString()
    note: string

    @IsOptional()
    @IsArray()
    tags: number[] = []
}