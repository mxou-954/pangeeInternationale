import { IsISO31661Alpha2, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';


export class CreateLocationCountryDto {
@IsNotEmpty()
@IsString()
@Length(2, 2)
@IsISO31661Alpha2()
code: string; // ex: FR


@IsNotEmpty()
@IsString()
name: string;


@IsOptional()
@IsString()
emojiFlag?: string;
}