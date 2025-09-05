'use client';
import { useEffect, useMemo, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  useMap,
} from 'react-leaflet';
import L, { LatLngBoundsExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const icon2xUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!; 


if (typeof window !== "undefined") {
  L.Icon.Default.mergeOptions({
    iconUrl,
    iconRetinaUrl: icon2xUrl,
    shadowUrl,
  });
}

type Props = {
  country: string | null | undefined;
  region?: string | null;
  commune?: string | null;
  village?: string | null;
  countryCode?: string;
  lang?: string;
};

type RegionGeo = {
  geojson: any;
  display: string;
  boundingbox: [string, string, string, string];
};

type Point = { lat: number; lon: number; display: string } | null;

async function safeJson(res: Response) {
  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('application/json')) {
    const text = await res.text();
    // si body vide -> on renvoie null plutôt que throw
    if (!text) return null;
    throw new Error(
      `HTTP ${res.status} ${res.statusText} — Non-JSON response: ${text.slice(
        0,
        200
      )}`
    );
  }
  return res.json();
}

function FitBounds({ bounds }: { bounds?: LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) map.fitBounds(bounds, { padding: [20, 20] });
  }, [bounds, map]);
  return null;
}

// --- API helpers ---
async function fetchRegion(
  country: string,
  region: string,
  lang = 'fr',
  countryCode?: string
) {
  const url = new URL(`${BASE_URL}/location/region`);
  url.searchParams.set('country', country);
  url.searchParams.set('region', region);
  if (countryCode) url.searchParams.set('countryCode', countryCode);
  if (lang) url.searchParams.set('lang', lang);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Region fetch failed ${res.status}`);
  const data = await safeJson(res); // ⇐ protège contre body vide / HTML
  return data as {
    geojson: any;
    display: string;
    boundingbox: [string, string, string, string];
  };
}

async function fetchPlace(
  country: string,
  region?: string,
  commune?: string,
  village?: string,
  lang = 'fr',
  countryCode?: string
) {
  const url = new URL(`${BASE_URL}/location/place`);
  url.searchParams.set('country', country);
  if (region) url.searchParams.set('region', region);
  if (commune) url.searchParams.set('commune', commune);
  if (village) url.searchParams.set('village', village);
  if (countryCode) url.searchParams.set('countryCode', countryCode);
  if (lang) url.searchParams.set('lang', lang);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Place fetch failed ${res.status}`);
  const data = await safeJson(res);
  return data as { lat: number; lon: number; display: string } | null;
}

export default function MapRegionCity({
  country,
  region,
  commune,
  village,
  countryCode,
  lang = 'fr',
}: Props) {
  const [regionGeo, setRegionGeo] = useState<RegionGeo | null>(null);
  const [place, setPlace] = useState<Point>(null);
  const [loading, setLoading] = useState(false);

  const wantsOutline = Boolean(country && region);
  const wantsPin = Boolean(country && region && (village || commune));

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        setRegionGeo(null);
        setPlace(null);

        if (wantsOutline && country && region) {
          try {
            const geo = await fetchRegion(country, region, lang, countryCode);
            if (!cancelled && geo && Array.isArray(geo.boundingbox)) {
              const [s, n, w, e] = geo.boundingbox.map(parseFloat);
              const b = L.latLngBounds([s, w], [n, e]);
              setRegionGeo({ ...geo, bounds: b });
            } else {
              setRegionGeo(null);
            }
          } catch (e) {
            console.error('❌ fetchRegion error:', e);
          }
        }

        if (wantsPin && country) {
          try {
            const p = await fetchPlace(
              country,
              region ?? undefined,
              commune ?? undefined,
              village ?? undefined,
              lang,
              countryCode
            );
            if (!cancelled && p) setPlace(p);
          } catch (e) {
            console.error('❌ fetchPlace error:', e);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    country,
    region,
    commune,
    village,
    countryCode,
    lang,
    wantsOutline,
    wantsPin,
  ]);

  const bounds = useMemo<LatLngBoundsExpression | undefined>(() => {
    if (regionGeo?.bounds) return regionGeo.bounds;
    if (place) {
      const b = L.latLngBounds([place.lat, place.lon], [place.lat, place.lon]);
      return b.pad(0.5);
    }
    return undefined;
  }, [regionGeo, place]);

  return (
    <div className="w-full h-[480px] rounded-xl overflow-hidden border">
      <MapContainer
        center={[5, 5]}
        zoom={5}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {regionGeo?.geojson && (
          <GeoJSON
            data={regionGeo.geojson as any}
            style={{
              color: '#22c55e',
              weight: 2,
              fill: true,
              fillOpacity: 0.15,
            }}
          />
        )}

        {place && (
          <Marker position={[place.lat, place.lon]}>
            <Popup>
              <div className="text-sm">
                <div className="font-medium">{village ?? commune}</div>
                <div className="text-gray-600">{place.display}</div>
              </div>
            </Popup>
          </Marker>
        )}

        <FitBounds bounds={bounds} />
      </MapContainer>

      {loading && <div className="p-2 text-xs text-gray-600">Chargement…</div>}
    </div>
  );
}
