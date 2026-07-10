import { Type, Transform } from "class-transformer";
import { IsBoolean, IsOptional, IsString, IsInt, IsIn } from "class-validator";

export class GetNoteDto {
    @IsString()
    @IsOptional()
    search?: string

    @IsString()
    @IsOptional()
    @IsIn(['created_at', 'updated_at', 'title'])
    sortby: string = "updated_at"

    @IsString()
    @IsOptional()
    @IsIn(['asc', 'desc'])
    order: string = "desc"


    @IsBoolean()
    @IsOptional()
    @Transform(({value}) => value === true || value === 'true')
    limit: boolean = false

    @IsInt()
    @IsOptional()
    @Type(() => Number)
    page: number = 0

    @IsInt()
    @IsOptional()
    @Type(() => Number)
    results: number = 5
}