// api/_httpWithNotify.ts (nouveau petit wrapper)
"use client";
import { http } from "./http";
import { getNotifier } from "@/lib/notifier";

type NotifyOpts = RequestInit & {
  successMessage?: string;
  errorMessage?: string;
  notifySuccessForGet?: boolean; // par défaut: pas de succès pour les GET
};

export async function httpWithNotify<T>(path: string, opts?: NotifyOpts): Promise<T> {
  const n = getNotifier();
  try {
    const data = await http<T>(path, opts);
    const method = (opts?.method ?? "GET").toUpperCase();
    if (opts?.successMessage && (opts?.notifySuccessForGet || method !== "GET")) {
      n.success(opts.successMessage);
    }
    return data;
  } catch (e) {
    const fallback = e instanceof Error ? e.message : "Erreur réseau";
    n.error(opts?.errorMessage ?? fallback);
    throw e;
  }
}
