// api/farmer.ts
import { httpWithNotify } from "./_httpWithNotify";

export type ApiOpts = {
  signal?: AbortSignal;
};

// GET: un agriculteur par ID (silencieux)
export const getFarmerById = (farmerId: string, opts?: ApiOpts) =>
  httpWithNotify(`/farmer/${farmerId}`, {
    method: "GET",
    signal: opts?.signal,
  });

// PATCH: toggle favori (messages par défaut)
export const toggleFarmerFavorite = (farmerId: string) =>
  httpWithNotify(`/farmer/fav/${farmerId}`, {
    method: "PATCH",
    successMessage: "Favori mis à jour.",
    errorMessage: "Erreur lors de la mise à jour du favori.",
  });

// DELETE: supprimer un agriculteur (messages par défaut)
export const deleteFarmer = (farmerId: string) =>
  httpWithNotify(`/farmer/${farmerId}`, {
    method: "DELETE",
    successMessage: "Agriculteur supprimé.",
    errorMessage: "Erreur lors de la suppression de l’agriculteur.",
  });

// GET: tous les agriculteurs (silencieux)
export const getAllFarmers = (opts?: ApiOpts) =>
  httpWithNotify(`/farmer`, {
    method: "GET",
    signal: opts?.signal,
  });

// POST: créer un agriculteur (messages par défaut)
export const createFarmer = (payload: any) =>
  httpWithNotify(`/farmer/`, {
    method: "POST",
    body: JSON.stringify(payload),
    successMessage: "Agriculteur créé avec succès.",
    errorMessage: "Erreur lors de la création de l’agriculteur.",
  });

// PATCH: mettre à jour un agriculteur (messages par défaut)
export const updateFarmer = (farmerId: string, payload: any) =>
  httpWithNotify(`/farmer/${farmerId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
    successMessage: "Agriculteur mis à jour.",
    errorMessage: "Erreur lors de la mise à jour de l’agriculteur.",
  });

// DELETE: supprimer un agriculteur par ID (messages par défaut)
export const deleteFarmerById = (farmerId: string) =>
  httpWithNotify(`/farmer/${farmerId}`, {
    method: "DELETE",
    successMessage: "Agriculteur supprimé.",
    errorMessage: "Erreur lors de la suppression de l’agriculteur.",
  });
