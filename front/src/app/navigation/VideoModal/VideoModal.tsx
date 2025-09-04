// VideoModal.tsx
'use client';
import { useEffect, useState } from 'react';

type Difficulty = 'debutant' | 'intermediaire' | 'avance';
type Langue = 'français' | 'wolof' | 'français/wolof';

type FormValues = {
  iframe: string;
  duree: number | '';
  formateur: string;
  langue: Langue;
  titre: string;
  description: string;
  difficulte: Difficulty;
  tags: string; // CSV dans le formulaire
};

type Props = {
  mode?: 'create' | 'edit';
  initialValues?: Partial<FormValues>;
  onSubmit: (payload: {
    iframe: string;
    duree: number;
    formateur: string;
    langue: Langue;
    titre: string;
    description: string;
    difficulte: Difficulty;
    tags: string[];
  }) => Promise<void>;
  onClose: () => void;
};

export default function VideoModal({
  mode = 'create',
  initialValues,
  onSubmit,
  onClose,
}: Props) {
  const [iframe, setIframe] = useState('');
  const [duree, setDuree] = useState<number | ''>('');
  const [formateur, setFormateur] = useState('');
  const [langue, setLangue] = useState<Langue>('français');
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [difficulte, setDifficulte] = useState<Difficulty>('debutant');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  // Pré-remplissage si édition
  useEffect(() => {
    if (!initialValues) return;
    setIframe(initialValues.iframe ?? '');
    setDuree(initialValues.duree ?? '');
    setFormateur(initialValues.formateur ?? '');
    setLangue((initialValues.langue as Langue) ?? 'français');
    setTitre(initialValues.titre ?? '');
    setDescription(initialValues.description ?? '');
    setDifficulte((initialValues.difficulte as Difficulty) ?? 'debutant');
    setTags(initialValues.tags ?? '');
  }, [initialValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      iframe,
      duree: duree === '' ? 0 : Number(duree),
      formateur,
      langue,
      titre,
      description,
      difficulte,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      setLoading(true);
      await onSubmit(payload); // c'est le parent qui fait create/update
      onClose();
    } catch (err) {
      console.error('Erreur soumission vidéo ❌', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">
        {/* Bouton fermeture */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">
          {mode === 'edit' ? 'Modifier la vidéo' : 'Nouvelle vidéo'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="titre" className="block text-sm font-medium">
              Titre
            </label>
            <input
              id="titre"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              required
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="iframe" className="block text-sm font-medium">
              Iframe / URL
            </label>
            <textarea
              id="iframe"
              rows={2}
              value={iframe}
              onChange={(e) => setIframe(e.target.value)}
              required
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="duree" className="block text-sm font-medium">
                Durée (sec)
              </label>
              <input
                id="duree"
                type="number"
                value={duree}
                onChange={(e) =>
                  setDuree(e.target.value ? Number(e.target.value) : '')
                }
                required
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="formateur" className="block text-sm font-medium">
                Formateur
              </label>
              <input
                id="formateur"
                value={formateur}
                onChange={(e) => setFormateur(e.target.value)}
                required
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="langue" className="block text-sm font-medium">
                Langue
              </label>
              <select
                id="langue"
                value={langue}
                onChange={(e) => setLangue(e.target.value as Langue)}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="français">Français</option>
                <option value="wolof">Wolof</option>
                <option value="français/wolof">Français/Wolof</option>
              </select>
            </div>
            <div>
              <label htmlFor="difficulte" className="block text-sm font-medium">
                Difficulté
              </label>
              <select
                id="difficulte"
                value={difficulte}
                onChange={(e) => setDifficulte(e.target.value as Difficulty)}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="debutant">Débutant</option>
                <option value="intermediaire">Intermédiaire</option>
                <option value="avance">Avancé</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium">
              Tags (séparés par ,)
            </label>
            <input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-60"
            >
              {loading
                ? 'Enregistrement...'
                : mode === 'edit'
                ? 'Mettre à jour'
                : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
