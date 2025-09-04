'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Save,
  MapPin,
  PieChart,
  AlertCircle,
  Check,
  Grid3X3,
} from 'lucide-react';
import {
  createZoneForField,
  deleteZone,
  getZonesByField,
  updateZone,
} from '../../../../../../../../../api/zones';

export default function ZonesManagementModal({
  isOpen,
  onClose,
  selectedField,
}) {
  const [zones, setZones] = useState([]);
  const [newZone, setNewZone] = useState({ name: '', percentage: '' });
  const [editingZone, setEditingZone] = useState(null);
  const [errors, setErrors] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const colors = [
    '#10B981',
    '#22C55E',
    '#4ADE80',
    '#86EFAC',
    '#3B82F6',
    '#2563EB',
    '#60A5FA',
    '#93C5FD',
    '#F59E0B',
    '#F97316',
    '#FB923C',
    '#FBBF24',
    '#8B5CF6',
    '#A855F7',
    '#C084FC',
    '#D8B4FE',
    '#EF4444',
    '#F43F5E',
    '#EC4899',
    '#F472B6',
    '#06B6D4',
    '#0EA5E9',
    '#38BDF8',
    '#67E8F9',
  ];

  // Générer une couleur aléatoire
  const generateColor = (() => {
    let availableColors = [...colors];

    return () => {
      if (availableColors.length === 0) {
        availableColors = [...colors]; // On réinitialise si on a tout utilisé
      }
      const index = Math.floor(Math.random() * availableColors.length);
      const color = availableColors[index];
      availableColors.splice(index, 1); // Retire la couleur choisie
      return color;
    };
  })();

  useEffect(() => {
    if (!isOpen || !selectedField) return;

    const ac = new AbortController();

    (async () => {
      try {
        const data: any[] = await getZonesByField(String(selectedField), {
          signal: ac.signal,
        });

        const zonesWithColors = (Array.isArray(data) ? data : []).map(
          (zone) => ({
            ...zone,
            color: generateColor(), // ta fonction existante
          })
        );

        if (!ac.signal.aborted) setZones(zonesWithColors);
      } catch (err) {
        if (!ac.signal.aborted) console.error('Erreur /zones :', err);
      }
    })();

    return () => ac.abort();
  }, [isOpen, selectedField]);

  // Calculer le pourcentage total
  const totalPercentage = Array.isArray(zones)
    ? zones.reduce((sum, zone) => sum + (Number(zone.percentage) || 0), 0)
    : 0;
  const remainingPercentage = 100 - totalPercentage;

  // Ajouter une nouvelle zone
  const handleAddZone = async () => {
    try {
      const created = await createZoneForField(String(selectedField), newZone);
      console.log('Zone créée :', created);

      // Optionnel : mettre à jour la liste en local
      setZones((prev) => [
        ...(prev ?? []),
        { ...created, color: generateColor?.() }, // si tu colorises les zones
      ]);

      // Optionnel : reset du form
      // setNewZone({ name: '', ... });
    } catch (err) {
      console.error('Erreur création zone :', err);
    }
  };

  // Modifier une zone
  // garde uniquement les champs autorisés par ton UpdateZoneDto
  const toZonePatchDto = (zone) => {
    const dto = {
      name: zone?.name?.trim(),
      // si ton DTO attend une string numérique (souvent le cas) :
      percentage:
        zone?.percentage === '' || zone?.percentage == null
          ? undefined
          : String(zone.percentage),
    };
    // retire les undefined pour éviter de les envoyer
    return Object.fromEntries(
      Object.entries(dto).filter(([, v]) => v !== undefined)
    );
  };

  const handleUpdateZone = async (id: string) => {
    if (!editingZone) return;

    // petite validation côté front
    const pct = Number(editingZone.percentage);
    if (Number.isNaN(pct) || pct < 0 || pct > 100) {
      setErrors({ percentage: 'Le pourcentage doit être entre 0 et 100.' });
      return;
    }

    try {
      const patchDto = toZonePatchDto(editingZone); // tu gardes ta fonction
      const updated: any = await updateZone(String(id), patchDto);

      // on garde la couleur locale existante
      setZones((prev: any[]) =>
        prev.map((zone: any) =>
          String(zone.id) === String(id)
            ? {
                ...zone,
                ...updated, // confirmation backend
                color: zone.color, // conserver la couleur locale
                percentage: Number(
                  updated?.percentage ?? editingZone.percentage
                ),
                name: (updated?.name ?? editingZone.name)?.trim(),
              }
            : zone
        )
      );
    } catch (err) {
      console.error('Erreur update zone :', err);
    } finally {
      setEditingZone(null);
      setErrors({});
    }
  };

  const hasActiveHarvest = (zone: any): boolean => {
    if (!zone?.harvest) return false;

    const toArray = Array.isArray(zone.harvest) ? zone.harvest : [zone.harvest];

    // “Active” = pas encore récoltée (harvestDate dans le futur) OU aucune date définie
    return toArray.some((h) => {
      if (!h?.harvestDate) return true; // si pas de date, on bloque par prudence
      const d = new Date(h.harvestDate);
      if (isNaN(d.getTime())) return true; // date invalide => on bloque
      return d > new Date(); // futur => pas encore récoltée
    });
  };

  const handleDeleteZone = async (id: string, zone: any) => {
    if (hasActiveHarvest(zone)) {
      alert(
        'Suppression impossible : une ou plusieurs cultures liées à cette zone ne sont pas encore récoltées.\n' +
          'Veuillez clôturer (ou replanifier) la récolte avant de supprimer la zone.'
      );
      return;
    }

    try {
      await deleteZone(id);
      setZones((prev) => prev.filter((z) => String(z.id) !== String(id)));
      console.log('Zone correctement supprimée');
    } catch (err: any) {
      // http.ts lève déjà une Error avec le message serveur si dispo
      console.error('Échec de la suppression', err);
      alert(
        'Échec de la suppression de la zone.\n' +
          (err?.message || 'Erreur inconnue')
      );
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  // Sauvegarder toutes les zones
  const handleSaveAll = async () => {
    // Appel API pour sauvegarder les zones
    console.log('Saving zones:', zones);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-100 backdrop-blur-md backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <Grid3X3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Gestion des Zones
                </h2>
                <p className="text-green-100 mt-1">
                  Divisez votre exploitation en zones distinctes
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Colonne gauche - Liste des zones */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-600" />
                Zones existantes
              </h3>

              {/* Résumé visuel */}
              <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-700">
                    Répartition actuelle
                  </h4>
                  <PieChart className="w-5 h-5 text-blue-600" />
                </div>

                {/* Barre de progression visuelle */}
                <div className="w-full bg-gray-200 rounded-full h-6 mb-3 overflow-hidden">
                  <div className="h-full flex">
                    {zones.map((zone, index) => (
                      <div
                        key={zone.id}
                        className="h-full transition-all duration-300 relative group"
                        style={{
                          width: `${zone.percentage}%`,
                          backgroundColor: zone.color,
                          marginRight: index < zones.length - 1 ? '1px' : '0',
                        }}
                      >
                        <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          {zone.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    Utilisé:{' '}
                    <span className="font-semibold text-gray-800">
                      {totalPercentage}%
                    </span>
                  </span>
                  <span className="text-gray-600">
                    Disponible:{' '}
                    <span className="font-semibold text-green-600">
                      {remainingPercentage}%
                    </span>
                  </span>
                </div>
              </div>

              {/* Liste des zones */}
              <div className="space-y-3">
                {zones.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Aucune zone définie</p>
                    <p className="text-sm mt-1">
                      Commencez par ajouter une zone
                    </p>
                  </div>
                ) : (
                  zones.map((zone) => (
                    <div
                      key={zone.id}
                      className={`bg-white border-2 rounded-xl p-4 transition-all ${
                        editingZone?.id === zone.id
                          ? 'border-blue-500 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {editingZone?.id === zone.id ? (
                        // Mode édition
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editingZone.name}
                            onChange={(e) =>
                              setEditingZone({
                                ...editingZone,
                                name: e.target.value,
                              })
                            }
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                              errors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Nom de la zone"
                          />
                          {errors.name && (
                            <p className="text-red-500 text-sm">
                              {errors.name}
                            </p>
                          )}

                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={editingZone.percentage}
                              onChange={(e) =>
                                setEditingZone({
                                  ...editingZone,
                                  percentage: e.target.value,
                                })
                              }
                              className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                                errors.percentage
                                  ? 'border-red-500'
                                  : 'border-gray-300'
                              }`}
                              placeholder="Pourcentage"
                              min="0"
                              max="100"
                              step="0.1"
                            />
                            <button
                              onClick={() => handleUpdateZone(zone.id)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              <Save className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingZone(null);
                                setErrors({});
                              }}
                              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                          {errors.percentage && (
                            <p className="text-red-500 text-sm">
                              {errors.percentage}
                            </p>
                          )}
                        </div>
                      ) : (
                        // Mode affichage
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: zone.color }}
                            />
                            <div>
                              <h4 className="font-medium text-gray-800">
                                {zone.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {zone.percentage}% du champ total
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingZone(zone);
                                setErrors({});
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(zone.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Confirmation de suppression */}
                      {showDeleteConfirm === zone.id && (
                        <div className="mt-3 p-3 bg-red-50 rounded-lg">
                          <p className="text-sm text-red-800 mb-2">
                            Êtes-vous sûr de vouloir supprimer cette zone ?
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDeleteZone(zone.id, zone)}
                              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                            >
                              Supprimer
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(null)}
                              className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 transition-colors"
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Colonne droite - Ajouter une zone */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-gray-600" />
                Ajouter une nouvelle zone
              </h3>

              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom de la zone
                    </label>
                    <input
                      type="text"
                      value={newZone.name}
                      onChange={(e) => {
                        setNewZone({ ...newZone, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: '' });
                      }}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-500 transition-colors ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Ex: Zone Nord - Mil"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pourcentage du champ total
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={newZone.percentage}
                        onChange={(e) => {
                          setNewZone({
                            ...newZone,
                            percentage: e.target.value,
                          });
                          if (errors.percentage)
                            setErrors({ ...errors, percentage: '' });
                        }}
                        className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:border-blue-500 transition-colors ${
                          errors.percentage
                            ? 'border-red-500'
                            : 'border-gray-300'
                        }`}
                        placeholder="Ex: 25"
                        min="0"
                        max="100"
                        step="0.1"
                      />
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                        %
                      </span>
                    </div>
                    {errors.percentage && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.percentage}
                      </p>
                    )}
                  </div>

                  {/* Indicateur du pourcentage disponible */}
                  {remainingPercentage > 0 && (
                    <div className="bg-white bg-opacity-70 rounded-lg p-3">
                      <p className="text-sm text-gray-600">
                        Pourcentage disponible:
                        <span className="font-semibold text-green-600 ml-1">
                          {remainingPercentage}%
                        </span>
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleAddZone}
                    disabled={remainingPercentage === 0}
                    className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                      remainingPercentage === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:shadow-lg transform hover:scale-105'
                    }`}
                  >
                    <Plus className="w-5 h-5" />
                    Ajouter la zone
                  </button>
                </div>

                {/* Message d'aide */}
                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                  <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Conseils pour diviser votre exploitation
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>
                      • Regroupez les cultures similaires dans une même zone
                    </li>
                    <li>
                      • Considérez l'exposition au soleil et l'accès à l'eau
                    </li>
                    <li>• Prévoyez des zones de rotation des cultures</li>
                    <li>• N'oubliez pas les zones de jachère si nécessaire</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {zones.length} zone{zones.length > 1 ? 's' : ''} définie
            {zones.length > 1 ? 's' : ''} •
            <span className="font-medium ml-1">{totalPercentage}%</span> du
            champ utilisé
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Annuler
            </button>
            <button
              onClick={handleSaveAll}
              className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all font-medium flex items-center gap-2"
            >
              <Check className="w-5 h-5" />
              Enregistrer les zones
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
