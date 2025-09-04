import { PartialType } from '@nestjs/mapped-types';
import { CreateLocationCountryDto } from './create-location-country.dto';


export class UpdateLocationCountryDto extends PartialType(CreateLocationCountryDto) {}