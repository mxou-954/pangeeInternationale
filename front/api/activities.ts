// api/activities.ts
import { httpWithNotify } from './_httpWithNotify';

export type ActivityPayload = Record<string, unknown>;

export type ApiOpts = {
  signal?: AbortSignal;
  successMessage?: string;
  errorMessage?: string;
  notifySuccessForGet?: boolean; // par défaut: pas de succès pour GET
};

// POST: créer une activité pour un agriculteur
export const createActivityForFarmer = (
  farmerId: string,
  payload: ActivityPayload,
  opts?: ApiOpts
) =>
  httpWithNotify(`/activities/${farmerId}`, {
    method: 'POST',
    body: JSON.stringify(payload),
    successMessage: opts?.successMessage ?? 'Activité créée avec succès.',
    errorMessage:
      opts?.errorMessage ?? 'Erreur lors de la création de l’activité.',
  });

// PATCH: mettre à jour une activité existante
export const updateActivity = (
  activityId: string,
  payload: ActivityPayload,
  opts?: ApiOpts
) =>
  httpWithNotify(`/activities/${activityId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
    successMessage: opts?.successMessage ?? 'Activité mise à jour.',
    errorMessage:
      opts?.errorMessage ?? 'Erreur lors de la mise à jour de l’activité.',
  });

// GET: toutes les activités (global)
export const getAllActivities = (opts?: ApiOpts) =>
  httpWithNotify(`/activities`, {
    method: 'GET',
    signal: opts?.signal,
    successMessage: opts?.successMessage,
    errorMessage: opts?.errorMessage,
    notifySuccessForGet: opts?.notifySuccessForGet,
  });

// DELETE: supprimer une activité
export const deleteActivity = (activityId: string, opts?: ApiOpts) =>
  httpWithNotify(`/activities/${activityId}`, {
    method: 'DELETE',
    successMessage: opts?.successMessage ?? 'Activité supprimée.',
    errorMessage:
      opts?.errorMessage ?? 'Erreur lors de la suppression de l’activité.',
  });

// GET: toutes les activités d’un agriculteur
export const getActivitiesAllByFarmer = (farmerId: string, opts?: ApiOpts) =>
  httpWithNotify(`/activities/all/${farmerId}`, {
    method: 'GET',
    signal: opts?.signal,
    successMessage: opts?.successMessage,
    errorMessage: opts?.errorMessage,
    notifySuccessForGet: opts?.notifySuccessForGet,
  });
