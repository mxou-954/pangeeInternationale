'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Leaf,
  Target,
  Sprout,
  Settings,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Save,
  AlertCircle,
} from 'lucide-react';
const BASE_URL = process.env.NEXT_PUBLIC_API_URL!; 

const NewFieldModal = ({
  isOpen,
  mode = 'create',
  initialData,
  onClose,
  onSubmit,
  fieldId,
}) => {
  const [modalStep, setModalStep] = useState(1);
  const [newField, setNewField] = useState(
    () =>
      initialData ?? {
        // Informations de base
        name: '',
        farmerId: 'current-farmer',

        // Caractéristiques physiques
        size: '',
        coordinates: {
          latitude: '',
          longitude: '',
        },
        address: '',
        altitude: '',
        slope: '',
        exposition: '',

        // Caractéristiques du sol
        soilType: '',
        soilPH: '',
        soilQuality: '',
        drainage: '',
        organicMatter: '',
        lastSoilAnalysis: '',

        // Infrastructure et équipements
        irrigationSystem: '',
        irrigationCapacity: '',
        waterSource: '',
        fencing: false,
        storage: '',
        accessibility: '',

        // Données historiques
        previousCrops: [],
        lastPlowing: '',
        lastFertilization: '',

        // Contraintes et risques
        climateRisks: [],
        pestRisks: [],
        diseaseHistory: [],

        // Informations légales
        ownershipType: '',
        lease: {
          startDate: '',
          endDate: '',
          cost: '',
        },
        certifications: [],

        // Métadonnées
        createdDate: new Date().toISOString().split('T')[0],
        status: 'planning',
        notes: '',
      }
  );

  useEffect(() => {
    if (initialData) setNewField(initialData);
  }, [initialData]);

  const updateField = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setNewField((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setNewField((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const toggleArrayValue = (field, value) => {
    setNewField((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const handleSubmit = () => {
    if (newField.name && newField.size && mode === 'create') {
      onSubmit(newField);
      resetForm();
    } else {
      handleEdit();
      resetForm();
      onClose();
    }
  };

  const handleEdit = async () => {
    const { id, farmer, createdDate, updatedDate, zones, activities, harvest, ...payload } = newField;

    // Conversion de types (le DTO attend des string)
    if (payload.size !== undefined) payload.size = String(payload.size);
    if (payload.altitude !== undefined)
      payload.altitude = String(payload.altitude);
    if (payload.slope !== undefined) payload.slope = String(payload.slope);
    if (payload.soilPH !== undefined) payload.soilPH = String(payload.soilPH);
    if (payload.organicMatter !== undefined)
      payload.organicMatter = String(payload.organicMatter);
    if (payload.irrigationCapacity !== undefined)
      payload.irrigationCapacity = String(payload.irrigationCapacity);

    // Exemple : éviter les chaînes vides => null
    Object.keys(payload).forEach((k) => {
      if (payload[k] === '') {
        payload[k] = null;
      }
    });

    try {
      const response = await fetch(`${BASE_URL}/field/${fieldId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        onSubmit(data);
      } else {
        console.error('Une erreur a été détectée');
      }
    } catch (err) {
      console.error('Une erreur a été détectée : ', err);
    }
  };

  const resetForm = () => {
    setModalStep(1);
    setNewField({
      name: '',
      farmerId: 'current-farmer',
      size: '',
      coordinates: { latitude: '', longitude: '' },
      address: '',
      altitude: '',
      slope: '',
      exposition: '',
      soilType: '',
      soilPH: '',
      soilQuality: '',
      drainage: '',
      organicMatter: '',
      lastSoilAnalysis: '',
      irrigationSystem: '',
      irrigationCapacity: '',
      waterSource: '',
      fencing: false,
      storage: '',
      accessibility: '',
      previousCrops: [],
      lastPlowing: '',
      lastFertilization: '',
      climateRisks: [],
      pestRisks: [],
      diseaseHistory: [],
      ownershipType: '',
      lease: { startDate: '', endDate: '', cost: '' },
      certifications: [],
      createdDate: new Date().toISOString().split('T')[0],
      status: 'planning',
      notes: '',
    });
  };

  const modalSteps = [
    { id: 1, title: 'Informations de Base', icon: MapPin },
    { id: 2, title: 'Caractéristiques Physiques', icon: Leaf },
    { id: 3, title: 'Sol & Drainage', icon: Target },
    { id: 4, title: 'Infrastructure', icon: Settings },
    { id: 5, title: 'Objectifs & Finalisation', icon: CheckCircle },
  ];

  const renderStepContent = () => {
    switch (modalStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du champ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newField.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Ex: Champ Nord, Parcelle A1..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Surface (hectares) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newField.size}
                  onChange={(e) => updateField('size', e.target.value)}
                  placeholder="Ex: 2.5"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse/Localisation
              </label>
              <input
                type="text"
                value={newField.address}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder="Adresse complète du champ"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de propriété
              </label>
              <select
                value={newField.ownershipType}
                onChange={(e) => updateField('ownershipType', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Sélectionner</option>
                <option value="propriete">Propriété</option>
                <option value="location">Location</option>
                <option value="fermage">Fermage</option>
                <option value="metayage">Métayage</option>
                <option value="other">Autre</option>
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Altitude (m)
                </label>
                <input
                  type="number"
                  value={newField.altitude}
                  onChange={(e) => updateField('altitude', e.target.value)}
                  placeholder="Ex: 150"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pente (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newField.slope}
                  onChange={(e) => updateField('slope', e.target.value)}
                  placeholder="Ex: 2.5"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-gray-700">
                  Exposition
                </label>
                <select
                  value={newField.exposition}
                  onChange={(e) => updateField('exposition', e.target.value)}
                  className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Sélectionner</option>
                  <option value="nord">Nord</option>
                  <option value="sud">Sud</option>
                  <option value="est">Est</option>
                  <option value="ouest">Ouest</option>
                  <option value="nord-est">Nord-Est</option>
                  <option value="nord-ouest">Nord-Ouest</option>
                  <option value="sud-est">Sud-Est</option>
                  <option value="sud-ouest">Sud-Ouest</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accessibilité
              </label>
              <select
                value={newField.accessibility}
                onChange={(e) => updateField('accessibility', e.target.value)}
                className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Sélectionner</option>
                <option value="excellente">Excellente</option>
                <option value="bonne">Bonne</option>
                <option value="moyenne">Moyenne</option>
                <option value="difficile">Difficile</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="fencing"
                checked={newField.fencing}
                onChange={(e) => updateField('fencing', e.target.checked)}
                className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
              />
              <label htmlFor="fencing" className="ml-2 text-sm text-gray-700">
                Champ clôturé
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stockage sur place
              </label>
              <input
                type="text"
                value={newField.storage}
                onChange={(e) => updateField('storage', e.target.value)}
                placeholder="Ex: Hangar 200m², Silo, Aucun..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de sol <span className="text-red-500">*</span>
                </label>
                <select
                  value={newField.soilType}
                  onChange={(e) => updateField('soilType', e.target.value)}
                  className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Sélectionner</option>
                  <option value="argileux">Argileux</option>
                  <option value="sableux">Sableux</option>
                  <option value="limoneux">Limoneux</option>
                  <option value="calcaire">Calcaire</option>
                  <option value="humifere">Humifère</option>
                  <option value="mixte">Mixte</option>
                  <option value="other">Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  pH du sol
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="14"
                  value={newField.soilPH}
                  onChange={(e) => updateField('soilPH', e.target.value)}
                  placeholder="Ex: 6.5"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qualité du sol
                </label>
                <select
                  value={newField.soilQuality}
                  onChange={(e) => updateField('soilQuality', e.target.value)}
                  className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Sélectionner</option>
                  <option value="excellente">Excellente</option>
                  <option value="bonne">Bonne</option>
                  <option value="moyenne">Moyenne</option>
                  <option value="faible">Faible</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Drainage
                </label>
                <select
                  value={newField.drainage}
                  onChange={(e) => updateField('drainage', e.target.value)}
                  className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Sélectionner</option>
                  <option value="excellent">Excellent</option>
                  <option value="bon">Bon</option>
                  <option value="moyen">Moyen</option>
                  <option value="faible">Faible</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Matière organique (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newField.organicMatter}
                  onChange={(e) => updateField('organicMatter', e.target.value)}
                  placeholder="Ex: 3.2"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dernière analyse sol
                </label>
                <input
                  type="date"
                  value={newField.lastSoilAnalysis}
                  onChange={(e) =>
                    updateField('lastSoilAnalysis', e.target.value)
                  }
                  className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Système d'irrigation <span className="text-red-500">*</span>
                </label>
                <select
                  value={newField.irrigationSystem}
                  onChange={(e) =>
                    updateField('irrigationSystem', e.target.value)
                  }
                  className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Sélectionner</option>
                  <option value="aspersion">Aspersion</option>
                  <option value="goutte-a-goutte">Goutte-à-goutte</option>
                  <option value="gravitaire">Gravitaire</option>
                  <option value="pivot">Pivot central</option>
                  <option value="other">Autre</option>
                  <option value="aucun">Aucun</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacité irrigation (L/h)
                </label>
                <input
                  type="number"
                  value={newField.irrigationCapacity}
                  onChange={(e) =>
                    updateField('irrigationCapacity', e.target.value)
                  }
                  placeholder="Ex: 5000"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source d'eau
              </label>
              <select
                value={newField.waterSource}
                onChange={(e) => updateField('waterSource', e.target.value)}
                className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Sélectionner</option>
                <option value="puits">Puits</option>
                <option value="riviere">Rivière</option>
                <option value="reseau">Réseau public</option>
                <option value="reservoir">Réservoir</option>
                <option value="forage">Forage</option>
                <option value="bassin">Bassin de rétention</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Risques climatiques
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  'Gel',
                  'Grêle',
                  'Sécheresse',
                  'Inondation',
                  'Vent fort',
                  'Orage',
                  'Autre'
                ].map((risk) => (
                  <label key={risk} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newField.climateRisks.includes(risk)}
                      onChange={() => toggleArrayValue('climateRisks', risk)}
                      className="h-4 w-4 text-green-600 rounded border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">{risk}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certifications
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['Bio', 'Label Rouge', 'AOP', 'IGP', 'HVE', 'Demeter', 'Autre'].map(
                  (cert) => (
                    <label key={cert} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newField.certifications.includes(cert)}
                        onChange={() =>
                          toggleArrayValue('certifications', cert)
                        }
                        className="h-4 w-4 text-green-600 rounded border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{cert}</span>
                    </label>
                  )
                )}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes additionnelles
              </label>
              <textarea
                value={newField.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder="Informations complémentaires, observations particulières..."
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Résumé du champ */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">
                Résumé du champ
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700 ">
                <div>
                  <span className="font-medium">Nom:</span>{' '}
                  {newField.name || 'Non défini'}
                </div>
                <div>
                  <span className="font-medium">Surface:</span> {newField.size}{' '}
                  ha
                </div>
                <div>
                  <span className="font-medium">Culture:</span>{' '}
                  {newField.address || 'Non définie'}
                </div>
                <div>
                  <span className="font-medium">Sol:</span>{' '}
                  {newField.soilType || 'Non défini'}
                </div>
                <div>
                  <span className="font-medium">Irrigation:</span>{' '}
                  {newField.irrigationSystem || 'Non défini'}
                </div>
              </div>
            </div>

            {/* Validation */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Vérifiez que toutes les informations obligatoires sont
                    renseignées avant de créer le champ.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-100 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'edit' ? 'Modifier le champ' : 'Ajouter un champ'}
            </h2>
            <p className="text-sm text-gray-600">
              Étape {modalStep} sur {modalSteps.length}:{' '}
              {modalSteps.find((s) => s.id === modalStep)?.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between">
            {modalSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      modalStep === step.id
                        ? 'bg-green-600 text-white'
                        : modalStep > step.id
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  {index < modalSteps.length - 1 && (
                    <div
                      className={`w-8 h-1 mx-2 ${
                        modalStep > step.id ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => setModalStep(Math.max(1, modalStep - 1))}
            disabled={modalStep === 1}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            Précédent
          </button>

          <div className="flex gap-3">
            {modalStep < modalSteps.length ? (
              <button
                onClick={() =>
                  setModalStep(Math.min(modalSteps.length, modalStep + 1))
                }
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Suivant
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!newField.name || !newField.size}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4" />
                {mode === 'edit' ? 'Enregistrer' : 'Créer'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewFieldModal;
