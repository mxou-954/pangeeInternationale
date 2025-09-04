// api/video.ts
import { httpWithNotify } from "./_httpWithNotify";

export type ApiOpts = { signal?: AbortSignal };

// POST: créer une vidéo tutoriel (messages par défaut)
export const createVideo = (payload: any) =>
  httpWithNotify("/tutorial-video", {
    method: "POST",
    body: JSON.stringify(payload),
    successMessage: "Vidéo créée avec succès.",
    errorMessage: "Erreur lors de la création de la vidéo.",
  });

// GET: toutes les vidéos tutoriel (silencieux par défaut)
export const getAllVideos = (opts?: ApiOpts) =>
  httpWithNotify("/tutorial-video", {
    method: "GET",
    signal: opts?.signal,
  });

export const deleteVideoById = (videoId: string) =>
  httpWithNotify(`/tutorial-video/${videoId}`, {
    method: "DELETE",
    successMessage: "Vidéo supprimée.",
    errorMessage: "Erreur lors de la suppression de la vidéo.",
  });

  export const updateVideo = (videoId: string, payload: any) =>
  httpWithNotify(`/tutorial-video/${videoId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
    successMessage: "Vidéo mis à jour.",
    errorMessage: "Erreur lors de la mise à jour du Vidéo.",
  });