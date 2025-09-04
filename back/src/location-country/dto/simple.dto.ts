import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';


export class CreateRegionDto {
@IsNotEmpty()
@IsString()
name: string;


@IsUUID()
countryId: string;
}


export class UpdateRegionDto {
@IsOptional()
@IsString()
name?: string;
}


export class CreateCommuneDto {
@IsNotEmpty()
@IsString()
name: string;


@IsUUID()
regionId: string;
}


export class UpdateCommuneDto {
@IsOptional()
@IsString()
name?: string;
}


export class CreateVillageDto {
@IsNotEmpty()
@IsString()
name: string;


@IsUUID()
communeId: string;
}


export class UpdateVillageDto {
@IsOptional()
@IsString()
name?: string;
}