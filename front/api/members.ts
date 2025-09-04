// api/members.ts
import { httpWithNotify } from "./_httpWithNotify";

export type ApiOpts = { signal?: AbortSignal };

// GET: membres d’un agriculteur (silencieux par défaut)
export const getMembersByFarmer = (farmerId: string, opts?: ApiOpts) =>
  httpWithNotify(`/members/${farmerId}`, {
    method: "GET",
    signal: opts?.signal,
  });

// POST: créer un membre (messages par défaut)
export const createMemberForFarmer = (farmerId: string, payload: any) =>
  httpWithNotify(`/members/${farmerId}`, {
    method: "POST",
    body: JSON.stringify(payload),
    successMessage: "Membre créé avec succès.",
    errorMessage: "Erreur lors de la création du membre.",
  });

// PATCH: mettre à jour un membre (messages par défaut)
export const updateMember = (memberId: string, payload: any) =>
  httpWithNotify(`/members/${memberId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
    successMessage: "Membre mis à jour.",
    errorMessage: "Erreur lors de la mise à jour du membre.",
  });

// DELETE: supprimer un membre (messages par défaut)
export const deleteMember = (memberId: string) =>
  httpWithNotify(`/members/${memberId}`, {
    method: "DELETE",
    successMessage: "Membre supprimé.",
    errorMessage: "Erreur lors de la suppression du membre.",
  });
