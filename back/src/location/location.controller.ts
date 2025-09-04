// location.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('region')
  async getRegion(
    @Query('country') country: string,
    @Query('region') region: string,
    @Query('countryCode') countryCode?: string,
    @Query('lang') lang = 'fr',
  ) {
    const data = await this.locationService.getRegionGeoJSON({ country, region, countryCode, lang });
    // Toujours renvoyer du JSON (même vide)
    return data ?? { geojson: null, display: null, boundingbox: null };
  }

  @Get('place')
  async getPlace(
    @Query('country') country: string,
    @Query('region') region?: string,
    @Query('commune') commune?: string,
    @Query('village') village?: string,
    @Query('countryCode') countryCode?: string,
    @Query('lang') lang = 'fr',
  ) {
    const data = await this.locationService.getPlacePoint({ country, region, commune, village, countryCode, lang });
    return data ?? { lat: null, lon: null, display: null };
  }

  @Get('map-data')
  async getMapData(
    @Query('country') country: string,
    @Query('region') region?: string,
    @Query('commune') commune?: string,
    @Query('village') village?: string,
    @Query('countryCode') countryCode?: string,
    @Query('lang') lang = 'fr',
  ) {
    const data = await this.locationService.getMapData({ country, region, commune, village, countryCode, lang });
    // { region: {…} | null, place: {…} | null }
    return data ?? { region: null, place: null };
  }
}
