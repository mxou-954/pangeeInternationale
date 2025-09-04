// api/auth.ts
import { httpWithNotify } from "./_httpWithNotify";

export const login = (payload: any) =>
  httpWithNotify("/login", {
    method: "POST",
    body: JSON.stringify(payload),
    successMessage: "Connexion réussie.",
    errorMessage: "Échec de la connexion.",
  });

  export const loginAdmin = (payload: any) =>
  httpWithNotify("/auth/admin/login", {
    method: "POST",
    body: JSON.stringify(payload),
    successMessage: "Connexion réussie.",
    errorMessage: "Échec de la connexion.",
  });
