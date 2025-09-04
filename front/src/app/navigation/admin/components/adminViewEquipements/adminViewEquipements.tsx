'use client';

import React, { useState } from 'react';
import {
  Settings,
  AlertTriangle,
  Calendar,
  MapPin,
  TrendingDown,
  TrendingUp,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Zap,
  DollarSign,
  Wrench,
  Archive,
  Shield,
  Truck,
  Search,
  Package,
} from 'lucide-react';

const getCategoryConfig = (category) => {
  switch (category?.toLowerCase()) {
    case 'irrigation':
      return { icon: '💧', label: 'Irrigation' };
    case 'tracteurs':
      return { icon: '🚜', label: 'Tracteurs' };
    case 'outils':
      return { icon: '🔧', label: 'Outils' };
    case 'machines':
      return { icon: '⚙️', label: 'Machines' };
    case 'vehicules':
      return { icon: '🚛', label: 'Véhicules' };
    default:
      return { icon: '🔩', label: category || 'Autre' };
  }
};

const getConditionConfig = (condition) => {
  switch (condition?.toLowerCase()) {
    case 'excellent':
    case 'excellent état':
      return {
        color: 'text-green-600',
        bg: 'bg-green-100',
        label: 'Excellent',
        score: 95,
      };
    case 'bon état':
    case 'bon':
      return {
        color: 'text-blue-600',
        bg: 'bg-blue-100',
        label: 'Bon',
        score: 80,
      };
    case 'état moyen':
    case 'moyen':
      return {
        color: 'text-yellow-600',
        bg: 'bg-yellow-100',
        label: 'Moyen',
        score: 60,
      };
    case 'mauvais état':
    case 'mauvais':
      return {
        color: 'text-red-600',
        bg: 'bg-red-100',
        label: 'Mauvais',
        score: 30,
      };
    default:
      return {
        color: 'text-gray-600',
        bg: 'bg-gray-100',
        label: 'N/D',
        score: 50,
      };
  }
};

const getMaintenanceStatus = (nextMaintenanceDate, condition) => {
  const today = new Date();
  const nextMaintenance = new Date(nextMaintenanceDate);
  const daysUntilMaintenance = Math.ceil(
    (nextMaintenance - today) / (1000 * 60 * 60 * 24)
  );

  if (daysUntilMaintenance < 0) {
    return {
      color: 'text-red-700 bg-red-50 border-red-200',
      icon: AlertTriangle,
      label: 'En retard',
      priority: 1,
    };
  }

  if (
    daysUntilMaintenance <= 7 ||
    condition?.toLowerCase().includes('mauvais')
  ) {
    return {
      color: 'text-red-700 bg-red-50 border-red-200',
      icon: AlertTriangle,
      label: 'Critique',
      priority: 1,
    };
  }

  if (
    daysUntilMaintenance <= 30 ||
    condition?.toLowerCase().includes('moyen')
  ) {
    return {
      color: 'text-orange-700 bg-orange-50 border-orange-200',
      icon: Clock,
      label: 'Bientôt',
      priority: 2,
    };
  }

  return {
    color: 'text-green-700 bg-green-50 border-green-200',
    icon: CheckCircle,
    label: 'OK',
    priority: 4,
  };
};

export default function AdminEquipmentPanel({ equipment = [] }) {
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [expandedEquipment, setExpandedEquipment] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const items = Array.isArray(equipment) ? equipment : [];

  // Stats sûres
  const totalQuantity = items.reduce(
    (acc, equip) => acc + (Number(equip?.quantity) || 0),
    0
  );
  const totalValue = items.reduce(
    (acc, equip) =>
      acc + (Number(equip?.purchasePrice) * Number(equip?.quantity) || 0),
    0
  );
  const criticalEquipment = items.filter((equip) => {
    const status = getMaintenanceStatus(
      equip?.nextMaintenanceDate,
      equip?.condition
    );
    return status.priority <= 2;
  }).length;
  const categories = new Set(items.map((equip) => equip?.category)).size;

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const d = new Date(dateString);
    return isNaN(+d)
      ? '—'
      : d.toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'short',
          year: '2-digit',
        });
  };

  const getDaysUntilMaintenance = (nextMaintenanceDate) => {
    if (!nextMaintenanceDate) return null;
    const today = new Date();
    const nextMaintenance = new Date(nextMaintenanceDate);
    if (isNaN(+nextMaintenance)) return null;
    return Math.ceil((nextMaintenance - today) / (1000 * 60 * 60 * 24));
  };

  const getEquipmentAge = (purchaseDate) => {
    if (!purchaseDate) return null;
    const today = new Date();
    const purchase = new Date(purchaseDate);
    if (isNaN(+purchase)) return null;
    const ageInDays = Math.floor((today - purchase) / (1000 * 60 * 60 * 24));
    const years = Math.floor(ageInDays / 365);
    const months = Math.floor((ageInDays % 365) / 30);
    return { years, months, days: ageInDays };
  };

  const toggleExpandCategory = (categoryName) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName);
    } else {
      newExpanded.add(categoryName);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleExpandEquipment = (equipmentId) => {
    const newExpanded = new Set(expandedEquipment);
    if (newExpanded.has(equipmentId)) {
      newExpanded.delete(equipmentId);
    } else {
      newExpanded.add(equipmentId);
    }
    setExpandedEquipment(newExpanded);
  };

  // Filtrer par recherche
  const filteredItems = items.filter(
    (equip) =>
      !searchTerm ||
      equip.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equip.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equip.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equip.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Regroupement par catégorie
  const equipmentsByCategory = filteredItems.reduce((groups, equip) => {
    const category = equip?.category || 'Autre';
    if (!groups[category]) groups[category] = [];
    groups[category].push(equip);
    return groups;
  }, {});

  return (
    <div className="bg-white">
      {/* Header avec métriques visuelles */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900">
            ⚙️ Gestion des Équipements
          </h2>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher équipement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Live</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {totalQuantity}
            </div>
            <div className="text-xs text-gray-500">Équipements</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {criticalEquipment}
            </div>
            <div className="text-xs text-gray-500">Maintenance urgente</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {totalValue.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Valeur totale</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{categories}</div>
            <div className="text-xs text-gray-500">Catégories</div>
          </div>
        </div>
      </div>

      {/* Liste par catégories */}
      <div className="divide-y divide-gray-100">
        {Object.keys(equipmentsByCategory).length > 0 ? (
          Object.entries(equipmentsByCategory).map(
            ([category, categoryEquipment]) => {
              const isExpanded = expandedCategories.has(category);
              const categoryConfig = getCategoryConfig(category);
              const alertCount = categoryEquipment.filter((equip) => {
                const status = getMaintenanceStatus(
                  equip?.nextMaintenanceDate,
                  equip?.condition
                );
                return status.priority <= 2;
              }).length;

              return (
                <div
                  key={category}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Ligne de catégorie */}
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <button
                          onClick={() => toggleExpandCategory(category)}
                          className="flex-shrink-0 p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-500" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">
                                {categoryConfig.icon}
                              </span>
                              <h3 className="font-semibold text-gray-900 text-base capitalize">
                                {category}
                              </h3>
                            </div>
                            {alertCount > 0 && (
                              <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-red-100 text-red-700 border border-red-200">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                {alertCount} alerte{alertCount > 1 ? 's' : ''}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center space-x-6 text-sm">
                            <div className="flex items-center space-x-1">
                              <Settings className="h-4 w-4 text-blue-600" />
                              <span className="font-bold text-blue-600">
                                {categoryEquipment.length}
                              </span>
                              <span className="text-gray-500">
                                équipement
                                {categoryEquipment.length > 1 ? 's' : ''}
                              </span>
                            </div>

                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <span className="font-bold text-green-600">
                                {categoryEquipment
                                  .reduce(
                                    (acc, equip) =>
                                      acc +
                                      (Number(equip?.purchasePrice) || 0) *
                                        (Number(equip?.quantity) || 0),
                                    0
                                  )
                                  .toLocaleString()}
                              </span>
                              <span className="text-gray-500">valeur</span>
                            </div>

                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4 text-purple-600" />
                              <span className="font-bold text-purple-600">
                                {
                                  new Set(
                                    categoryEquipment
                                      .map((e) => e?.location)
                                      .filter(Boolean)
                                  ).size
                                }
                              </span>
                              <span className="text-gray-500">
                                lieu
                                {new Set(
                                  categoryEquipment
                                    .map((e) => e?.location)
                                    .filter(Boolean)
                                ).size > 1
                                  ? 'x'
                                  : ''}
                              </span>
                            </div>
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

                  {/* Liste des équipements */}
                  {isExpanded && (
                    <div className="px-4 pb-4 bg-gradient-to-b from-gray-50 to-white border-t border-gray-100">
                      <div className="pt-4 space-y-3">
                        {categoryEquipment
                          .sort((a, b) => {
                            const statusA = getMaintenanceStatus(
                              a?.nextMaintenanceDate,
                              a?.condition
                            );
                            const statusB = getMaintenanceStatus(
                              b?.nextMaintenanceDate,
                              b?.condition
                            );
                            return statusA.priority - statusB.priority;
                          })
                          .map((equip) => {
                            const isEquipExpanded = expandedEquipment.has(
                              equip.id
                            );
                            const maintenanceStatus = getMaintenanceStatus(
                              equip?.nextMaintenanceDate,
                              equip?.condition
                            );
                            const conditionConfig = getConditionConfig(
                              equip?.condition
                            );
                            const daysUntilMaintenance =
                              getDaysUntilMaintenance(
                                equip?.nextMaintenanceDate
                              );
                            const age = getEquipmentAge(equip?.purchaseDate);
                            const StatusIcon = maintenanceStatus.icon;

                            return (
                              <div
                                key={equip.id}
                                className="bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
                              >
                                {/* Ligne compacte d'équipement */}
                                <div className="p-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                                      <button
                                        onClick={() =>
                                          toggleExpandEquipment(equip.id)
                                        }
                                        className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors"
                                      >
                                        {isEquipExpanded ? (
                                          <ChevronDown className="h-4 w-4 text-gray-400" />
                                        ) : (
                                          <ChevronRight className="h-4 w-4 text-gray-400" />
                                        )}
                                      </button>

                                      <StatusIcon
                                        className={`w-4 h-4 flex-shrink-0 ${
                                          maintenanceStatus.color.split(' ')[0]
                                        }`}
                                      />

                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                          <div>
                                            <h4 className="font-semibold text-gray-900 truncate">
                                              {equip.name || 'Sans nom'}
                                            </h4>
                                            <p className="text-sm text-gray-500 truncate">
                                              {equip.brand} {equip.model} • Qté:{' '}
                                              {equip.quantity} •{' '}
                                              {equip.subcategory}
                                            </p>
                                          </div>

                                          <div className="flex items-center space-x-4 text-sm">
                                            <span
                                              className={`px-2 py-1 rounded text-xs font-medium ${conditionConfig.bg} ${conditionConfig.color}`}
                                            >
                                              {conditionConfig.label}
                                            </span>
                                            {equip.location && (
                                              <span className="text-gray-600 flex items-center">
                                                <MapPin className="h-3 w-3 mr-1" />
                                                {equip.location.substring(
                                                  0,
                                                  15
                                                )}
                                                ...
                                              </span>
                                            )}
                                            {daysUntilMaintenance !== null && (
                                              <span
                                                className={`font-medium flex items-center ${
                                                  daysUntilMaintenance < 0
                                                    ? 'text-red-600'
                                                    : daysUntilMaintenance <= 30
                                                    ? 'text-orange-600'
                                                    : 'text-gray-600'
                                                }`}
                                              >
                                                <Wrench className="h-3 w-3 mr-1" />
                                                {daysUntilMaintenance < 0
                                                  ? `${Math.abs(
                                                      daysUntilMaintenance
                                                    )}j retard`
                                                  : `${daysUntilMaintenance}j`}
                                              </span>
                                            )}
                                            <span className="font-bold text-purple-600 flex items-center">
                                              <DollarSign className="h-3 w-3 mr-1" />
                                              {(
                                                (Number(equip.purchasePrice) ||
                                                  0) *
                                                (Number(equip.quantity) || 0)
                                              ).toLocaleString()}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <span
                                      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border ${maintenanceStatus.color} ml-3`}
                                    >
                                      <StatusIcon className="h-3 w-3 mr-1" />
                                      {maintenanceStatus.label}
                                    </span>
                                  </div>
                                </div>

                                {/* Détails expandables d'équipement */}
                                {isEquipExpanded && (
                                  <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
                                    <div className="pt-4 grid grid-cols-3 gap-4">
                                      {/* Spécifications */}
                                      <div className="bg-white p-3 rounded border">
                                        <h5 className="text-sm font-bold text-gray-900 mb-2 flex items-center">
                                          <Settings className="h-4 w-4 mr-1" />
                                          SPÉCIFICATIONS
                                        </h5>
                                        <div className="space-y-1 text-xs">
                                          <div className="flex justify-between">
                                            <span className="text-gray-500">
                                              Marque:
                                            </span>
                                            <span className="font-medium">
                                              {equip.brand || '—'}
                                            </span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-gray-500">
                                              Modèle:
                                            </span>
                                            <span className="font-medium">
                                              {equip.model || '—'}
                                            </span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-gray-500">
                                              N° Série:
                                            </span>
                                            <span className="font-mono text-xs">
                                              {equip.serialNumber || '—'}
                                            </span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-gray-500">
                                              Quantité:
                                            </span>
                                            <span className="font-bold text-blue-600">
                                              {equip.quantity || 0}
                                            </span>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Maintenance */}
                                      <div className="bg-white p-3 rounded border">
                                        <h5 className="text-sm font-bold text-gray-900 mb-2 flex items-center">
                                          <Wrench className="h-4 w-4 mr-1" />
                                          MAINTENANCE
                                        </h5>
                                        <div className="space-y-1 text-xs">
                                          <div className="flex justify-between">
                                            <span className="text-gray-500">
                                              État:
                                            </span>
                                            <span
                                              className={`px-1 py-0.5 rounded text-xs ${conditionConfig.bg} ${conditionConfig.color}`}
                                            >
                                              {conditionConfig.label}
                                            </span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-gray-500">
                                              Dernière:
                                            </span>
                                            <span className="font-medium">
                                              {formatDate(
                                                equip.lastMaintenanceDate
                                              )}
                                            </span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-gray-500">
                                              Prochaine:
                                            </span>
                                            <span className="font-medium">
                                              {formatDate(
                                                equip.nextMaintenanceDate
                                              )}
                                            </span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-gray-500">
                                              Localisation:
                                            </span>
                                            <span className="font-medium truncate max-w-20">
                                              {equip.location || '—'}
                                            </span>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Analyse */}
                                      <div className="bg-white p-3 rounded border">
                                        <h5 className="text-sm font-bold text-gray-900 mb-2 flex items-center">
                                          <TrendingUp className="h-4 w-4 mr-1" />
                                          ANALYSE
                                        </h5>
                                        <div className="space-y-1 text-xs">
                                          <div className="flex justify-between">
                                            <span className="text-gray-500">
                                              Prix unitaire:
                                            </span>
                                            <span className="font-bold text-purple-600">
                                              {Number(equip.purchasePrice) || 0}
                                            </span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-gray-500">
                                              Valeur totale:
                                            </span>
                                            <span className="font-bold text-green-600">
                                              {(
                                                (Number(equip.purchasePrice) ||
                                                  0) *
                                                (Number(equip.quantity) || 0)
                                              ).toLocaleString()}
                                            </span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-gray-500">
                                              Âge:
                                            </span>
                                            <span className="font-medium text-blue-600">
                                              {age
                                                ? `${age.years}a ${age.months}m`
                                                : '—'}
                                            </span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-gray-500">
                                              Utilisation:
                                            </span>
                                            <span className="font-medium text-gray-700">
                                              {age ? `${age.days}j` : '—'}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Notes */}
                                    {equip.notes && equip.notes.trim() && (
                                      <div className="mt-3 bg-yellow-50 p-3 rounded border border-yellow-200">
                                        <h5 className="text-xs font-bold text-gray-900 mb-1 flex items-center">
                                          <Archive className="h-3 w-3 mr-1" />
                                          NOTES
                                        </h5>
                                        <p className="text-xs text-gray-700">
                                          {equip.notes}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              );
            }
          )
        ) : (
          <div className="text-center py-12">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-500 mb-2">
              {searchTerm
                ? 'Aucun équipement trouvé'
                : 'Aucun équipement disponible'}
            </p>
            <p className="text-sm text-gray-400">
              {searchTerm
                ? 'Essayez un autre terme de recherche'
                : 'Les équipements apparaîtront ici une fois ajoutés'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
