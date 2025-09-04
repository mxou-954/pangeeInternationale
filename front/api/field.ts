// api/field.ts
import { httpWithNotify } from "./_httpWithNotify";

export type ApiOpts = {
  signal?: AbortSignal;
  notifySuccessForGet?: boolean; // GET reste silencieux par défaut
};

// GET: champs d’un agriculteur (silencieux)
export const getFieldsByFarmer = (farmerId: string, opts?: ApiOpts) =>
  httpWithNotify(`/field/${farmerId}`, {
    method: "GET",
    signal: opts?.signal,
    notifySuccessForGet: opts?.notifySuccessForGet,
  });

// GET: un champ (silencieux)
export const getFieldById = (fieldId: string, opts?: ApiOpts) =>
  httpWithNotify(`/field/one/${fieldId}`, {
    method: "GET",
    signal: opts?.signal,
    notifySuccessForGet: opts?.notifySuccessForGet,
  });

// POST: créer un champ (messages par défaut)
export const createFieldForFarmer = (farmerId: string, payload: any) =>
  httpWithNotify(`/field/${farmerId}`, {
    method: "POST",
    body: JSON.stringify(payload),
    successMessage: "Champ créé avec succès.",
    errorMessage: "Erreur lors de la création du champ.",
  });

// DELETE: supprimer un champ (messages par défaut)
export const deleteField = (fieldId: string) =>
  httpWithNotify(`/field/${fieldId}`, {
    method: "DELETE",
    successMessage: "Champ supprimé.",
    errorMessage: "Erreur lors de la suppression du champ.",
  });
