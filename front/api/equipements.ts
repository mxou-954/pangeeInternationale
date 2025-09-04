// api/equipements.ts
import { httpWithNotify } from "./_httpWithNotify";

export type ApiOpts = {
  signal?: AbortSignal;
};

// GET: tous les équipements d’un agriculteur (silencieux)
export const getEquipementsByFarmer = (farmerId: string, opts?: ApiOpts) =>
  httpWithNotify(`/equipements/all/${farmerId}`, {
    method: "GET",
    signal: opts?.signal,
  });

// DELETE: supprimer un équipement (messages par défaut)
export const deleteEquipement = (equipementId: string) =>
  httpWithNotify(`/equipements/${equipementId}`, {
    method: "DELETE",
    successMessage: "Équipement supprimé.",
    errorMessage: "Erreur lors de la suppression de l’équipement.",
  });

// PATCH: édition rapide (messages par défaut)
export const quickEditEquipement = (equipementId: string, payload: any) =>
  httpWithNotify(`/equipements/quickEdit/${equipementId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
    successMessage: "Équipement mis à jour.",
    errorMessage: "Erreur lors de la mise à jour de l’équipement.",
  });

// POST: créer un équipement (messages par défaut)
export const createEquipementForFarmer = (farmerId: string, payload: any) =>
  httpWithNotify(`/equipements/${farmerId}`, {
    method: "POST",
    body: JSON.stringify(payload),
    successMessage: "Équipement créé.",
    errorMessage: "Erreur lors de la création de l’équipement.",
  });

// PATCH: mettre à jour un équipement (messages par défaut)
export const updateEquipement = (equipementId: string, payload: any) =>
  httpWithNotify(`/equipements/${equipementId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
    successMessage: "Équipement mis à jour.",
    errorMessage: "Erreur lors de la mise à jour de l’équipement.",
  });

// GET: tous les équipements (silencieux)
export const getAllEquipements = (opts?: ApiOpts) =>
  httpWithNotify(`/equipements`, {
    method: "GET",
    signal: opts?.signal,
  });
