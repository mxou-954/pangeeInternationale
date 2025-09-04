import { Injectable, BadRequestException } from '@nestjs/common';

type RegionGeo = {
  geojson: any;
  display: string;
  // boundingbox Nominatim: [south, north, west, east] en string
  boundingbox: [string, string, string, string];
};
type PlacePoint = { lat: number; lon: number; display: string };

@Injectable()
export class LocationService {
  private base = 'https://nominatim.openstreetmap.org';

  private headers(lang = 'fr') {
    return {
      'Accept-Language': lang,
      // Nominatim recommande d'identifier l'app (User-Agent ou Referer)
      'User-Agent': 'YourApp/1.0 (contact@example.com)',
    };
  }

  /**
   * Recherche une région (boundary/administrative) et renvoie son GeoJSON via /lookup
   */
  async getRegionGeoJSON(params: {
    country: string;
    region: string;
    countryCode?: string;
    lang?: string;
  }): Promise<RegionGeo | null> {
    const { country, region, countryCode, lang = 'fr' } = params;
    if (!country || !region) throw new BadRequestException('country & region required');

    // 1) /search pour trouver osm_id + osm_type
    const search = new URL(`${this.base}/search`);
    search.searchParams.set('format', 'jsonv2');
    search.searchParams.set('addressdetails', '1');
    search.searchParams.set('extratags', '1');
    search.searchParams.set('limit', '5');
    search.searchParams.set('dedupe', '1');
    search.searchParams.set('country', country);
    search.searchParams.set('state', region);
    if (countryCode) search.searchParams.set('countrycodes', countryCode.toLowerCase());

    const res = await fetch(search.toString(), { headers: this.headers(lang) });
    if (!res.ok) return null;
    const data = (await res.json()) as any[];

    if (!Array.isArray(data) || data.length === 0) return null;

    // privilégier boundary/administrative
    const admins = data.filter((r) => r.class === 'boundary' && r.type === 'administrative');
    const best = (admins.length ? admins : data)[0];
    if (!best) return null;

    // 2) /lookup pour récupérer polygon_geojson
    const letter = best.osm_type === 'relation' ? 'R' : best.osm_type === 'way' ? 'W' : 'N';
    const lookup = new URL(`${this.base}/lookup`);
    lookup.searchParams.set('format', 'json');
    lookup.searchParams.set('polygon_geojson', '1');
    lookup.searchParams.set('osm_ids', `${letter}${best.osm_id}`);

    const lres = await fetch(lookup.toString(), { headers: this.headers(lang) });
    if (!lres.ok) return null;
    const ldata = (await lres.json()) as any[];

    const feat = ldata?.[0];
    if (!feat?.geojson) return null;

    return {
      geojson: feat.geojson,
      display: best.display_name,
      boundingbox: feat.boundingbox ?? best.boundingbox,
    };
  }

  /**
   * Recherche un point (lat/lon) pour ville/commune en contexte pays (+ région si dispo)
   */
  async getPlacePoint(params: {
    country: string;
    region?: string;
    commune?: string;
    village?: string;
    countryCode?: string;
    lang?: string;
  }): Promise<PlacePoint | null> {
    const { country, region, commune, village, countryCode, lang = 'fr' } = params;
    if (!country) throw new BadRequestException('country required');

    // on priorise village > commune
    const target = village || commune;
    if (!target) return null;

    const q = [target, region, country].filter(Boolean).join(', ');
    const url = new URL(`${this.base}/search`);
    url.searchParams.set('q', q);
    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('limit', '1');
    url.searchParams.set('dedupe', '1');
    if (countryCode) url.searchParams.set('countrycodes', countryCode.toLowerCase());

    const res = await fetch(url.toString(), { headers: this.headers(lang) });
    if (!res.ok) return null;
    const data = (await res.json()) as any[];
    const p = data?.[0];
    if (!p) return null;

    return {
      lat: parseFloat(p.lat),
      lon: parseFloat(p.lon),
      display: p.display_name,
    };
  }

  /**
   * Route combinée: région (geojson) + place (point) selon ce qui est fourni.
   */
  async getMapData(params: {
    country: string;
    region?: string;
    commune?: string;
    village?: string;
    countryCode?: string;
    lang?: string;
  }) {
    const { country, region, commune, village, countryCode, lang } = params;

    const [regionGeo, place] = await Promise.all([
      region ? this.getRegionGeoJSON({ country, region, countryCode, lang }) : Promise.resolve(null),
      this.getPlacePoint({ country, region, commune, village, countryCode, lang }),
    ]);

    return { region: regionGeo, place };
  }
}
