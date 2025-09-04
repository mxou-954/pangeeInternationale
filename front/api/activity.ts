// api/activity.ts
import { httpWithNotify } from "./_httpWithNotify";

export type ApiOpts = {
  signal?: AbortSignal;
  notifySuccessForGet?: boolean;
};

// GET: activités d’un agriculteur
export const getActivitiesByFarmer = (farmerId: string, opts?: ApiOpts) =>
  httpWithNotify(`/activity/${farmerId}`, {
    method: "GET",
    signal: opts?.signal,
    // GET = pas de message par défaut
  });

// POST: créer une activité
export const createActivityForFarmer = (
  farmerId: string,
  payload: any,
  opts?: ApiOpts
) =>
  httpWithNotify(`/activity/${farmerId}`, {
    method: "POST",
    body: JSON.stringify(payload),
    successMessage: "Activité créée avec succès.",
    errorMessage: "Erreur lors de la création de l’activité.",
  });
