// api/guide.ts
import { httpWithNotify } from "./_httpWithNotify";

export type ApiOpts = {
  signal?: AbortSignal;
};

// GET: guide d’un agriculteur (silencieux par défaut)
export const getGuideByFarmer = (farmerId: string, opts?: ApiOpts) =>
  httpWithNotify<any[]>(`/guide/${farmerId}`, {
    method: "GET",
    signal: opts?.signal,
  });

// POST: créer un module de guide (messages par défaut)
export const createGuideModule = (farmerId: string, payload: any) =>
  httpWithNotify(`/guide/${farmerId}`, {
    method: "POST",
    body: JSON.stringify(payload),
    successMessage: "Module de guide créé.",
    errorMessage: "Erreur lors de la création du module de guide.",
  });

// PATCH: mettre à jour un module de guide (messages par défaut)
export const updateGuideModule = (
  farmerId: string,
  moduleId: string,
  payload: any
) =>
  httpWithNotify(`/guide/${farmerId}/${moduleId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
    successMessage: "Module de guide mis à jour.",
    errorMessage: "Erreur lors de la mise à jour du module de guide.",
  });
