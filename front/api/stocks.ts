// api/stocks.ts
import { httpWithNotify } from "./_httpWithNotify";

export type ApiOpts = { signal?: AbortSignal };

// GET: tous les stocks d’un agriculteur (silencieux)
export const getAllStocks = (farmerId: string, opts?: ApiOpts) =>
  httpWithNotify(`/stocks/all/${farmerId}`, {
    method: "GET",
    signal: opts?.signal,
  });

// PATCH: mettre à jour la quantité d’un stock (messages par défaut)
export const updateStock = (stockId: string, quantity: number) =>
  httpWithNotify(`/stocks/${stockId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
    successMessage: "Stock mis à jour.",
    errorMessage: "Erreur lors de la mise à jour du stock.",
  });

// DELETE: supprimer un stock (messages par défaut)
export const deleteStock = (stockId: string) =>
  httpWithNotify(`/stocks/${stockId}`, {
    method: "DELETE",
    successMessage: "Stock supprimé.",
    errorMessage: "Erreur lors de la suppression du stock.",
  });

// POST: créer un stock (messages par défaut)
export const createStockForFarmer = (farmerId: string, payload: any) =>
  httpWithNotify(`/stocks/${farmerId}`, {
    method: "POST",
    body: JSON.stringify(payload),
    successMessage: "Stock créé.",
    errorMessage: "Erreur lors de la création du stock.",
  });

// PUT: mise à jour complète d’un stock (messages par défaut)
export const updateStockEverything = (stockId: string, payload: any) =>
  httpWithNotify(`/stocks/everything/${stockId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    successMessage: "Stock mis à jour.",
    errorMessage: "Erreur lors de la mise à jour du stock.",
  });
