// api/documents.ts
"use client";

import { httpWithNotify } from "./_httpWithNotify";
import { getNotifier } from "@/lib/notifier";

export type ApiOpts = {
  signal?: AbortSignal;
};

// GET: documents d’un utilisateur (silencieux par défaut)
export const getDocumentsByUser = (userId: string, opts?: ApiOpts) =>
  httpWithNotify(`/documents?userId=${encodeURIComponent(userId)}`, {
    method: "GET",
    signal: opts?.signal,
  });

// POST: upload d’un document (multipart) + toasts intégrés
export const uploadDocument = async (farmerId: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("recipientId", farmerId);

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/upload`, {
      method: "POST",
      body: formData, // ne surtout pas fixer Content-Type ici
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => res.statusText);
      throw new Error(msg || `HTTP ${res.status}`);
    }

    const data = await res.json();
    getNotifier().success("Document envoyé.");
    return data;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Échec de l’envoi du document.";
    getNotifier().error(msg);
    throw e;
  }
};
