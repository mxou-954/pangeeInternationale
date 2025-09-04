'use client';

import React, { useState } from 'react';
import {
  MapPin,
  User,
  Calendar,
  Droplets,
  Leaf,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  Eye,
  MoreHorizontal,
  Zap,
  Target,
  Activity,
} from 'lucide-react';

const getStatusConfig = (status) => {
  switch (status) {
    case 'active':
      return {
        color: 'text-green-700 bg-green-50 border-green-200',
        icon: CheckCircle,
        label: 'Actif',
        dot: 'bg-green-500',
      };
    case 'planning':
      return {
        color: 'text-blue-700 bg-blue-50 border-blue-200',
        icon: Calendar,
        label: 'Planification',
        dot: 'bg-blue-500',
      };
    case 'completed':
      return {
        color: 'text-gray-700 bg-gray-50 border-gray-200',
        icon: CheckCircle,
        label: 'Terminé',
        dot: 'bg-gray-500',
      };
    default:
      return {
        color: 'text-yellow-700 bg-yellow-50 border-yellow-200',
        icon: AlertTriangle,
        label: 'Inconnu',
        dot: 'bg-yellow-500',
      };
  }
};

const getQualityConfig = (quality) => {
  switch (quality) {
    case 'excellente':
      return {
        color: 'text-green-600',
        bg: 'bg-green-100',
        label: 'Excellent',
        score: 95,
      };
    case 'bonne':
      return {
        color: 'text-blue-600',
        bg: 'bg-blue-100',
        label: 'Bon',
        score: 75,
      };
    case 'moyenne':
      return {
        color: 'text-yellow-600',
        bg: 'bg-yellow-100',
        label: 'Moyen',
        score: 50,
      };
    default:
      return {
        color: 'text-red-600',
        bg: 'bg-red-100',
        label: 'Faible',
        score: 25,
      };
  }
};

export default function AdminFieldsPanel({ fields = [] }) {
  const [expandedFields, setExpandedFields] = useState(new Set());
  const [showMoreCrops, setShowMoreCrops] = useState(new Set());
  const [showCropActivities, setShowCropActivities] = useState(new Set());
  const [showCropProblems, setShowCropProblems] = useState(new Set());

  const items = Array.isArray(fields) ? fields : [];

  // Stats sûres
  const totalArea = items.reduce((acc, f) => acc + (Number(f?.size) || 0), 0);
  const activeCount = items.filter((f) => f?.status === 'active').length;
  const farmerCount = new Set(
    items.map(
      (f) => `${f?.farmer?.firstName ?? ''}${f?.farmer?.lastName ?? ''}`
    )
  ).size;

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const d = new Date(dateString);
    return isNaN(+d)
      ? '—'
      : d.toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'short',
        });
  };

  const getPlantingProgress = (plantingDate, harvestDate) => {
    if (!plantingDate || !harvestDate)
      return { progress: 0, status: 'unknown' };

    const today = new Date();
    const planted = new Date(plantingDate);
    const harvest = new Date(harvestDate);

    if (isNaN(+planted) || isNaN(+harvest))
      return { progress: 0, status: 'unknown' };

    const totalDuration = harvest - planted;
    const elapsed = today - planted;
    const progress = Math.max(
      0,
      Math.min(100, (elapsed / totalDuration) * 100)
    );

    if (today < planted) return { progress: 0, status: 'planned' };
    if (today > harvest) return { progress: 100, status: 'completed' };

    return {
      progress: Math.round(progress),
      status: progress < 30 ? 'early' : progress < 70 ? 'growing' : 'mature',
    };
  };

  const getDaysUntilHarvest = (harvestDate) => {
    if (!harvestDate) return 0;
    const today = new Date();
    const harvest = new Date(harvestDate);
    if (isNaN(+harvest)) return 0;
    const diffTime = harvest - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressColor = (status) => {
    switch (status) {
      case 'early':
        return 'bg-blue-500';
      case 'growing':
        return 'bg-yellow-500';
      case 'mature':
        return 'bg-orange-500';
      case 'completed':
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  const toggleExpand = (fieldId) => {
    const newExpanded = new Set(expandedFields);
    if (newExpanded.has(fieldId)) {
      newExpanded.delete(fieldId);
    } else {
      newExpanded.add(fieldId);
    }
    setExpandedFields(newExpanded);
  };

  const toggleShowMoreCrops = (fieldId) => {
    const newShowMore = new Set(showMoreCrops);
    if (newShowMore.has(fieldId)) {
      newShowMore.delete(fieldId);
    } else {
      newShowMore.add(fieldId);
    }
    setShowMoreCrops(newShowMore);
  };

  const toggleShowCropActivities = (fieldId, cropIndex) => {
    const cropKey = `${fieldId}-${cropIndex}`;
    const newShowActivities = new Set(showCropActivities);
    if (newShowActivities.has(cropKey)) {
      newShowActivities.delete(cropKey);
    } else {
      newShowActivities.add(cropKey);
    }
    setShowCropActivities(newShowActivities);
  };

  const toggleShowCropProblems = (fieldId, cropIndex) => {
    const cropKey = `${fieldId}-${cropIndex}`;
    const newShowProblems = new Set(showCropProblems);
    if (newShowProblems.has(cropKey)) {
      newShowProblems.delete(cropKey);
    } else {
      newShowProblems.add(cropKey);
    }
    setShowCropProblems(newShowProblems);
  };

  // Fonction pour obtenir les activités d'une culture spécifique
  const getCropActivities = (field, crop) => {
    if (!Array.isArray(field.activities)) return [];
    return field.activities.filter((activity) => {
      // Si l'activité a une plantation liée, vérifier si elle correspond à cette culture
      if (activity?.plantation) {
        return (
          activity.plantation.cropType === crop?.cropType &&
          activity.plantation.variety === crop?.variety &&
          activity.plantation.plantingDate === crop?.plantingDate
        );
      }
      return false;
    });
  };

  // Fonction pour trier les cultures
  const getSortedCrops = (crops) => {
    if (!Array.isArray(crops)) return [];

    // Séparer les cultures actives et terminées
    const activeCrops = crops.filter((crop) => !crop?.isEnd);
    const endedCrops = crops.filter((crop) => crop?.isEnd);

    // Fonction de tri par progression (plus élevé en premier)
    const sortByProgress = (a, b) => {
      const progressA = getPlantingProgress(
        a?.plantingDate,
        a?.harvestDate
      ).progress;
      const progressB = getPlantingProgress(
        b?.plantingDate,
        b?.harvestDate
      ).progress;
      return progressB - progressA; // Ordre décroissant
    };

    // Trier chaque groupe
    activeCrops.sort(sortByProgress);
    endedCrops.sort(sortByProgress);

    // Retourner actives d'abord, puis terminées
    return [...activeCrops, ...endedCrops];
  };

  return (
    <div className="bg-white">
      {/* Header avec métriques visuelles */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900">
            📊 Tableau de Bord Champs
          </h2>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Temps réel</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {items.length}
            </div>
            <div className="text-xs text-gray-500">Champs totaux</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {activeCount}
            </div>
            <div className="text-xs text-gray-500">En production</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {totalArea.toFixed(1)}
            </div>
            <div className="text-xs text-gray-500">Hectares</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {farmerCount}
            </div>
            <div className="text-xs text-gray-500">Agriculteurs</div>
          </div>
        </div>
      </div>

      {/* Liste des champs */}
      <div className="divide-y divide-gray-100">
        {items.length > 0 ? (
          items.map((field) => {
            const isExpanded = expandedFields.has(field.id);
            const showMore = showMoreCrops.has(field.id);
            const hasMultipleCrops =
              Array.isArray(field.harvest) && field.harvest.length > 2;

            // Trier les cultures
            const sortedCrops = getSortedCrops(field.harvest);
            const cropsToShow = showMore
              ? sortedCrops
              : sortedCrops.slice(0, 2);
            const statusConfig = getStatusConfig(field.status);
            const qualityConfig = getQualityConfig(field.soilQuality);

            return (
              <div
                key={field.id}
                className="hover:bg-gray-50 transition-all duration-200"
              >
                {/* Ligne principale avec indicateurs visuels */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <button
                        onClick={() => toggleExpand(field.id)}
                        className="flex-shrink-0 p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-500" />
                        )}
                      </button>

                      {/* Indicateur de statut coloré */}
                      <div
                        className={`w-3 h-3 rounded-full ${statusConfig.dot} flex-shrink-0`}
                      ></div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="font-semibold text-gray-900 truncate text-base">
                            {field.name || 'Sans nom'}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border ${statusConfig.color}`}
                            >
                              <statusConfig.icon className="h-3 w-3 mr-1" />
                              {statusConfig.label}
                            </span>
                            {field.soilQuality && (
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-md ${qualityConfig.bg} ${qualityConfig.color}`}
                              >
                                Sol: {qualityConfig.label}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Métriques visuelles */}
                        <div className="flex items-center space-x-6 text-sm">
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <span className="font-bold text-green-600">
                              {Number(field.size) || 0}
                            </span>
                            <span className="text-gray-500">ha</span>
                          </div>

                          {field.farmer && (
                            <div className="flex items-center space-x-1">
                              <User className="h-4 w-4 text-blue-600" />
                              <span className="font-medium text-gray-700 truncate max-w-32">
                                {field.farmer.firstName} {field.farmer.lastName}
                              </span>
                            </div>
                          )}

                          {Array.isArray(field.harvest) &&
                            field.harvest.length > 0 && (
                              <div className="flex items-center space-x-1">
                                <Leaf className="h-4 w-4 text-emerald-600" />
                                <span className="font-bold text-emerald-600">
                                  {field.harvest.length}
                                </span>
                                <span className="text-gray-500">
                                  culture{field.harvest.length > 1 ? 's' : ''}
                                </span>
                              </div>
                            )}

                          {field.irrigationCapacity && (
                            <div className="flex items-center space-x-1">
                              <Droplets className="h-4 w-4 text-cyan-600" />
                              <span className="font-bold text-cyan-600">
                                {Number(field.irrigationCapacity)}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
                        <MoreHorizontal className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Détails expandables avec structure visuelle */}
                {isExpanded && (
                  <div className="px-4 pb-4 bg-gradient-to-b from-gray-50 to-white border-t border-gray-100">
                    <div className="pt-4 space-y-5">
                      {/* Section Informations - Grid visuel */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <div className="flex items-center mb-2">
                            <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-xs font-semibold text-gray-500 uppercase">
                              Localisation
                            </span>
                          </div>
                          <p className="text-sm text-gray-900 font-medium">
                            {field.address || 'Adresse non renseignée'}
                          </p>
                        </div>

                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <div className="flex items-center mb-2">
                            <Droplets className="h-4 w-4 text-cyan-500 mr-2" />
                            <span className="text-xs font-semibold text-gray-500 uppercase">
                              Irrigation
                            </span>
                          </div>
                          <p className="text-sm text-gray-900 font-medium">
                            {field.irrigationSystem || 'Non défini'}
                          </p>
                          {field.irrigationCapacity && (
                            <div className="mt-2">
                              <div className="flex justify-between text-xs mb-1">
                                <span>Capacité</span>
                                <span className="font-bold">
                                  {Number(field.irrigationCapacity)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-cyan-500 h-2 rounded-full transition-all"
                                  style={{
                                    width: `${Number(
                                      field.irrigationCapacity
                                    )}%`,
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Zones de culture avec barres visuelles */}
                      {Array.isArray(field.zones) && field.zones.length > 0 && (
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center mb-3">
                            <Target className="h-4 w-4 text-purple-500 mr-2" />
                            <span className="text-sm font-bold text-gray-900">
                              ZONES DE CULTURE
                            </span>
                          </div>
                          <div className="space-y-3">
                            {field.zones.map((zone) => (
                              <div
                                key={zone.id ?? zone.name}
                                className="flex items-center justify-between"
                              >
                                <span className="text-sm font-medium text-gray-900 min-w-0 truncate mr-3">
                                  {zone.name || 'Zone sans nom'}
                                </span>
                                <div className="flex items-center space-x-3 flex-shrink-0">
                                  <div className="w-24 bg-gray-200 rounded-full h-3">
                                    <div
                                      className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all"
                                      style={{
                                        width: `${
                                          Number(zone.percentage) || 0
                                        }%`,
                                      }}
                                    />
                                  </div>
                                  <span className="text-sm font-bold text-gray-900 w-12 text-right">
                                    {Number(zone.percentage) || 0}%
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Cultures avec barres de progression */}
                      {Array.isArray(field.harvest) &&
                        field.harvest.length > 0 && (
                          <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center">
                                <Activity className="h-4 w-4 text-green-500 mr-2" />
                                <span className="text-sm font-bold text-gray-900">
                                  CULTURES ACTIVES
                                </span>
                              </div>
                              {hasMultipleCrops && (
                                <button
                                  onClick={() => toggleShowMoreCrops(field.id)}
                                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold bg-blue-50 px-2 py-1 rounded"
                                >
                                  {showMore
                                    ? 'Voir moins'
                                    : `Voir tout (${field.harvest.length})`}
                                </button>
                              )}
                            </div>

                            <div className="space-y-4">
                              {cropsToShow?.map((crop, idx) => {
                                const progressData = getPlantingProgress(
                                  crop?.plantingDate,
                                  crop?.harvestDate
                                );
                                const daysRemaining = getDaysUntilHarvest(
                                  crop?.harvestDate
                                );
                                const cropActivities = getCropActivities(
                                  field,
                                  crop
                                );
                                const cropKey = `${field.id}-${idx}`;
                                const showActivities =
                                  showCropActivities.has(cropKey);
                                const showProblems =
                                  showCropProblems.has(cropKey);
                                const hasProblems =
                                  crop?.problemsEncountered &&
                                  crop.problemsEncountered.trim();

                                return (
                                  <div
                                    key={idx}
                                    className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border border-gray-100"
                                  >
                                    <div className="flex items-center justify-between mb-3">
                                      <div className="flex items-center">
                                        <Leaf className="h-5 w-5 text-green-600 mr-2" />
                                        <span className="font-bold text-gray-900 capitalize text-base">
                                          {crop?.cropType || 'Culture inconnue'}
                                        </span>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        {crop?.variety && (
                                          <span className="text-xs text-gray-600 bg-white px-3 py-1 rounded-full border">
                                            {crop.variety}
                                          </span>
                                        )}
                                        {hasProblems && (
                                          <button
                                            onClick={() =>
                                              toggleShowCropProblems(
                                                field.id,
                                                idx
                                              )
                                            }
                                            className="flex items-center space-x-1 px-2 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-700 rounded-md transition-colors"
                                          >
                                            <AlertTriangle className="h-3 w-3" />
                                            <span>!</span>
                                            {showProblems ? (
                                              <ChevronDown className="h-3 w-3" />
                                            ) : (
                                              <ChevronRight className="h-3 w-3" />
                                            )}
                                          </button>
                                        )}
                                        {cropActivities.length > 0 && (
                                          <button
                                            onClick={() =>
                                              toggleShowCropActivities(
                                                field.id,
                                                idx
                                              )
                                            }
                                            className="flex items-center space-x-1 px-2 py-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors"
                                          >
                                            <Activity className="h-3 w-3" />
                                            <span>{cropActivities.length}</span>
                                            {showActivities ? (
                                              <ChevronDown className="h-3 w-3" />
                                            ) : (
                                              <ChevronRight className="h-3 w-3" />
                                            )}
                                          </button>
                                        )}
                                      </div>
                                    </div>

                                    {/* Barre de progression du cycle */}
                                    <div className="mb-4">
                                      <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-semibold text-gray-600">
                                          CYCLE DE CULTURE
                                        </span>
                                        <span className="text-xs font-bold text-gray-900">
                                          {progressData.progress}% complété
                                        </span>
                                      </div>
                                      <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                          className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(
                                            progressData.status
                                          )}`}
                                          style={{
                                            width: `${progressData.progress}%`,
                                          }}
                                        />
                                      </div>
                                    </div>

                                    {/* Métriques en grid */}
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                      <div className="bg-white p-2 rounded border">
                                        <div className="text-xs text-gray-500 mb-1">
                                          📅 Plantation
                                        </div>
                                        <div className="font-bold text-gray-900 text-sm">
                                          {formatDate(crop?.plantingDate)}
                                        </div>
                                      </div>
                                      <div className="bg-white p-2 rounded border">
                                        <div className="text-xs text-gray-500 mb-1">
                                          🌾 Récolte
                                        </div>
                                        <div className="font-bold text-gray-900 text-sm">
                                          {formatDate(crop?.harvestDate)}
                                        </div>
                                      </div>
                                      <div className="bg-white p-2 rounded border">
                                        <div className="text-xs text-gray-500 mb-1">
                                          ⏱️ Restant
                                        </div>
                                        <div
                                          className={`font-bold text-sm ${
                                            daysRemaining > 0
                                              ? 'text-orange-600'
                                              : 'text-green-600'
                                          }`}
                                        >
                                          {daysRemaining > 0
                                            ? `${daysRemaining}j`
                                            : 'Prêt'}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Problèmes rencontrés */}
                                    {showProblems && hasProblems && (
                                      <div className="mt-4 pt-4 border-t border-red-100 bg-red-50 -mx-4 px-4 rounded">
                                        <div className="flex items-center mb-3">
                                          <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                                          <span className="text-sm font-bold text-red-900">
                                            Problèmes rencontrés
                                          </span>
                                        </div>
                                        <div className="bg-white p-3 rounded border border-red-100">
                                          <p className="text-sm text-gray-700 leading-relaxed">
                                            {crop.problemsEncountered}
                                          </p>
                                        </div>
                                      </div>
                                    )}

                                    {/* Activités de cette culture */}
                                    {showActivities &&
                                      cropActivities.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-blue-100 bg-blue-50 -mx-4 -mb-4 px-4 pb-4 rounded-b-lg">
                                          <div className="flex items-center mb-3">
                                            <Activity className="h-4 w-4 text-blue-600 mr-2" />
                                            <span className="text-sm font-bold text-blue-900">
                                              Activités sur cette culture
                                            </span>
                                          </div>
                                          <div className="space-y-2">
                                            {cropActivities.map(
                                              (activity, actIdx) => (
                                                <div
                                                  key={actIdx}
                                                  className="flex items-center justify-between py-2 px-3 bg-white rounded border border-blue-100 text-sm hover:bg-blue-50 transition-colors"
                                                >
                                                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                                                    {activity?.status ===
                                                    'completed' ? (
                                                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                                    ) : activity?.status ===
                                                      'planned' ? (
                                                      <Calendar className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                                    ) : (
                                                      <Clock className="h-4 w-4 text-orange-500 flex-shrink-0" />
                                                    )}

                                                    <div className="flex-1 min-w-0">
                                                      <div className="flex items-center space-x-2">
                                                        <span className="font-medium text-gray-900 capitalize truncate">
                                                          {activity?.activityType ||
                                                            'Activité'}
                                                        </span>
                                                        {activity?.operator && (
                                                          <span className="text-gray-600 text-xs truncate">
                                                            par{' '}
                                                            {
                                                              activity.operator
                                                                .firstName
                                                            }
                                                          </span>
                                                        )}
                                                        {activity?.stock &&
                                                          activity?.quantity && (
                                                            <span className="text-gray-500 text-xs">
                                                              •{' '}
                                                              {
                                                                activity.quantity
                                                              }
                                                              {activity.unit}
                                                            </span>
                                                          )}
                                                      </div>
                                                      {(activity?.startTime ||
                                                        activity?.endTime) && (
                                                        <div className="text-xs text-gray-500 mt-0.5">
                                                          {activity?.startTime &&
                                                          activity?.endTime
                                                            ? `${activity.startTime.slice(
                                                                0,
                                                                5
                                                              )}-${activity.endTime.slice(
                                                                0,
                                                                5
                                                              )}`
                                                            : activity?.startTime
                                                            ? activity.startTime.slice(
                                                                0,
                                                                5
                                                              )
                                                            : activity.endTime.slice(
                                                                0,
                                                                5
                                                              )}
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>

                                                  <div className="text-xs text-gray-500 font-medium flex-shrink-0">
                                                    {formatDate(activity?.date)}
                                                  </div>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      )}

                                    {/* Yield section */}
                                    {Number(crop?.yieldTonnes) > 0 && (
                                      <div className="mt-3 pt-3 border-t border-green-100 bg-green-50">
                                        <div className="flex items-center justify-center">
                                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                                          <span className="text-sm font-bold text-green-700">
                                            {crop.yieldTonnes}T récoltées avec
                                            succès
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                      {/* Certifications */}
                      {Array.isArray(field.certifications) &&
                        field.certifications.length > 0 && (
                          <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center mb-3">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm font-bold text-gray-900">
                                CERTIFICATIONS
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {field.certifications.map((cert, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-gradient-to-r from-green-100 to-green-50 text-green-800 text-xs font-semibold rounded-full border border-green-200"
                                >
                                  ✓ {cert}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-gray-50">
            <div className="bg-white p-8 rounded-lg mx-4 border-2 border-dashed border-gray-300">
              <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-semibold text-gray-500 mb-2">
                Aucun champ disponible
              </p>
              <p className="text-sm text-gray-400">
                Les champs apparaîtront ici une fois créés
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
