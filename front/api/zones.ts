// api/zones.ts
import { httpWithNotify } from "./_httpWithNotify";

export type ApiOpts = { signal?: AbortSignal };

// GET: zones par field (silencieux)
export const getZonesByField = (fieldId: string, opts?: ApiOpts) =>
  httpWithNotify(`/zones/${fieldId}`, {
    method: "GET",
    signal: opts?.signal,
  });

// GET: une zone par ID (silencieux)
export const getZoneById = (zoneId: string, opts?: ApiOpts) =>
  httpWithNotify(`/zones/one/${zoneId}`, {
    method: "GET",
    signal: opts?.signal,
  });

// POST: créer une zone (messages par défaut)
export const createZoneForField = (fieldId: string, payload: any) =>
  httpWithNotify(`/zones/${fieldId}`, {
    method: "POST",
    body: JSON.stringify(payload),
    successMessage: "Zone créée avec succès.",
    errorMessage: "Erreur lors de la création de la zone.",
  });

// PATCH: mettre à jour une zone (messages par défaut)
export const updateZone = (zoneId: string, payload: any) =>
  httpWithNotify(`/zones/${zoneId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
    successMessage: "Zone mise à jour.",
    errorMessage: "Erreur lors de la mise à jour de la zone.",
  });

// DELETE: supprimer une zone (messages par défaut)
export const deleteZone = (zoneId: string) =>
  httpWithNotify(`/zones/${zoneId}`, {
    method: "DELETE",
    successMessage: "Zone supprimée.",
    errorMessage: "Erreur lors de la suppression de la zone.",
  });
