// api/locations.ts
const BASE = 'http://localhost:3005/locations';

// ————— Types de réponse (optionnels mais pratiques) —————
export type CountryDTO = {
  id: string;
  name: string;
  code: string;
  flag?: string;
  count: { regions: number; communes: number; villages: number };
};

export type RegionDTO = {
  id: string;
  name: string;
  countryId?: string;
  count: { communes: number; villages: number };
};

export type CommuneDTO = {
  id: string;
  name: string;
  regionId?: string;
  count: { villages: number };
};

export type VillageDTO = { id: string; name: string };

export type LocationsPayload = {
  countries: Array<{
    id: string;
    name: string;
    code: string;
    flag?: string;
    count: CountryDTO['count'];
  }>;
  regions: Record<
    string,
    Array<{
      id: string;
      name: string;
      countryId: string;
      count: RegionDTO['count'];
    }>
  >;
  communes: Record<
    string,
    Array<{
      id: string;
      name: string;
      regionId: string;
      count: CommuneDTO['count'];
    }>
  >;
  villages: Record<string, Array<{ id: string; name: string }>>;
};

// ————— Helper HTTP générique —————
async function http<T>(url: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    // Ajoute ici Authorization si besoin
    ...opts,
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ————— CREATE —————
export const createCountry = (data: {
  name: string;
  code: string;
  flag?: string;
}) =>
  http(`${BASE}/countries`, {
    method: 'POST',
    body: JSON.stringify({
      name: data.name,
      code: data.code,
      emojiFlag: data.flag,
    }),
  });

export const createRegion = (data: { name: string; countryId: string }) =>
  http(`${BASE}/regions`, {
    method: 'POST',
    body: JSON.stringify({ name: data.name, countryId: data.countryId }),
  });

export const createCommune = (data: { name: string; regionId: string }) =>
  http(`${BASE}/communes`, {
    method: 'POST',
    body: JSON.stringify({ name: data.name, regionId: data.regionId }),
  });

export const createVillage = (data: { name: string; communeId: string }) =>
  http(`${BASE}/villages`, {
    method: 'POST',
    body: JSON.stringify({ name: data.name, communeId: data.communeId }),
  });

// ————— READ (GET) —————
export const getLocationsPayload = () =>
  http<LocationsPayload>(`${BASE}/payload`);

export const getCountries = () => http<CountryDTO[]>(`${BASE}/countries`);

export const getRegionsByCountry = (countryId: string) =>
  http<RegionDTO[]>(
    `${BASE}/regions?countryId=${encodeURIComponent(countryId)}`
  );

export const getCommunesByRegion = (regionId: string) =>
  http<CommuneDTO[]>(
    `${BASE}/communes?regionId=${encodeURIComponent(regionId)}`
  );

export const getVillagesByCommune = (communeId: string) =>
  http<VillageDTO[]>(
    `${BASE}/villages?communeId=${encodeURIComponent(communeId)}`
  );

// ——— PATCH ———
export const patchCountry = (
  id: string,
  data: Partial<{ name: string; code: string; flag: string }>
) =>
  http(`${BASE}/countries/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify({
      name: data.name,
      code: data.code,
      emojiFlag: data.flag, // côté back c'est `emojiFlag`
    }),
  });

export const patchRegion = (
  id: string,
  data: Partial<{ name: string; countryId: string }>
) =>
  http(`${BASE}/regions/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify({
      name: data.name,
      countryId: data.countryId,
    }),
  });

export const patchCommune = (
  id: string,
  data: Partial<{ name: string; regionId: string }>
) =>
  http(`${BASE}/communes/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify({
      name: data.name,
      regionId: data.regionId,
    }),
  });

export const patchVillage = (
  id: string,
  data: Partial<{ name: string; communeId: string }>
) =>
  http(`${BASE}/villages/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify({
      name: data.name,
      communeId: data.communeId,
    }),
  });

// ——— DELETE ———
export const deleteCountry = (id: string) =>
  http(`${BASE}/countries/${encodeURIComponent(id)}`, { method: 'DELETE' });

export const deleteRegion = (id: string) =>
  http(`${BASE}/regions/${encodeURIComponent(id)}`, { method: 'DELETE' });

export const deleteCommune = (id: string) =>
  http(`${BASE}/communes/${encodeURIComponent(id)}`, { method: 'DELETE' });

export const deleteVillage = (id: string) =>
  http(`${BASE}/villages/${encodeURIComponent(id)}`, { method: 'DELETE' });
