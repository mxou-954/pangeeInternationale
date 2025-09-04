function toObj(val: unknown, dict: Record<string, any> | undefined, oldVal: any) {
  // 1) Pas de valeur nouvelle → garder l'ancien objet (ou null)
  if (val == null) {
    return oldVal ?? null;
  }

  // 2) Si on nous donne un id (string/number) → essayer de résoudre via le dictionnaire
  if (typeof val === 'string' || typeof val === 'number') {
    const key = String(val);
    const fromDict = dict ? dict[key] : undefined;

    if (fromDict !== undefined) {
      // trouvé dans le référentiel
      return fromDict;
    }

    if (oldVal != null) {
      // pas trouvé, on garde ce qu'on avait déjà pour ne pas afficher "N/A"
      return oldVal;
    }

    // dernier recours : stub minimal pour éviter un crash en attendant mieux
    return { id: key };
  }

  // 3) Sinon, c'est déjà un objet complet → on le garde tel quel
  return val;
}
