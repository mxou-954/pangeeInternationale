// api/comments.ts
import { httpWithNotify } from "./_httpWithNotify";

export type ApiOpts = {
  signal?: AbortSignal;
  notifySuccessForGet?: boolean; // si un jour tu veux afficher un succès pour GET
};

// GET: commentaires d’un agriculteur (silencieux par défaut)
export const getCommentsByFarmer = (farmerId: string, opts?: ApiOpts) =>
  httpWithNotify(`/comments/${farmerId}`, {
    method: "GET",
    signal: opts?.signal,
    // pas de messages par défaut pour GET
  });

// POST: créer un commentaire (messages par défaut)
export const createCommentForFarmer = (
  farmerId: string,
  payload: any,
  _opts?: ApiOpts
) =>
  httpWithNotify(`/comments/${farmerId}`, {
    method: "POST",
    body: JSON.stringify(payload),
    successMessage: "Commentaire ajouté.",
    errorMessage: "Erreur lors de l’ajout du commentaire.",
  });

// DELETE: supprimer un commentaire (messages par défaut)
export const deleteComment = (commentId: string, _opts?: ApiOpts) =>
  httpWithNotify(`/comments/${commentId}`, {
    method: "DELETE",
    successMessage: "Commentaire supprimé.",
    errorMessage: "Erreur lors de la suppression du commentaire.",
  });
