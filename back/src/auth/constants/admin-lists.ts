// Ces listes vivent côté backend, pas exposées.
// Rappel : on NE FAIT PAS d'association email↔mdp ; on vérifie séparément.
export const ALLOWED_ADMIN_EMAILS = [
  'admin@ferme.com',
  'super.admin@ferme.com',
];

export const ALLOWED_ADMIN_PASSWORDS = [
  'ChangeMe123!',
  'TrèsSecret!2025',
];
