// api/harvests.ts
import { httpWithNotify } from "./_httpWithNotify";

export type ApiOpts = { signal?: AbortSignal };

// POST: créer une récolte pour un field
export const createHarvest = (fieldId: string, payload: any) =>
  httpWithNotify(`/harvests/${fieldId}`, {
    method: "POST",
    body: JSON.stringify(payload),
    successMessage: "Récolte créée.",
    errorMessage: "Erreur lors de la création de la récolte.",
  });

// PATCH: mettre à jour une récolte existante
export const updateHarvest = (harvestId: string, payload: any) =>
  httpWithNotify(`/harvests/${harvestId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
    successMessage: "Récolte mise à jour.",
    errorMessage: "Erreur lors de la mise à jour de la récolte.",
  });

// GET: plantations par field (silencieux)
export const getPlantationsByField = (fieldId: string) =>
  httpWithNotify(`/harvests/${fieldId}`, { method: "GET" });

// GET: récoltes par field (silencieux)
export const getHarvestsByField = (fieldId: string, opts?: ApiOpts) =>
  httpWithNotify(`/harvests/${fieldId}`, {
    method: "GET",
    signal: opts?.signal,
  });

// PATCH: clôturer une récolte
export const closeHarvest = (fieldId: string, harvestId: string) =>
  httpWithNotify(`/harvests/closeHarvest/${fieldId}/${harvestId}`, {
    method: "PATCH",
    successMessage: "Récolte clôturée.",
    errorMessage: "Erreur lors de la clôture de la récolte.",
  });

// DELETE: supprimer une récolte
export const deleteHarvestById = (harvestId: string) =>
  httpWithNotify(`/harvests/${harvestId}`, {
    method: "DELETE",
    successMessage: "Récolte supprimée.",
    errorMessage: "Erreur lors de la suppression de la récolte.",
  });

// GET: récoltes d’un agriculteur (silencieux)
export const getHarvestsFromFarmer = (farmerId: string, opts?: ApiOpts) =>
  httpWithNotify(`/harvests/fromFarmer/${farmerId}`, {
    method: "GET",
    signal: opts?.signal,
  });
