'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  MapPin,
  Droplets,
  Leaf,
  Clock,
  DollarSign,
  Edit3,
  Trash2,
  X,
  Eye,
  Target,
  Sprout,
  BarChart3,
  Filter,
  Search,
  Grid,
  List,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { getHarvestsByField } from '../../../../../../../../api/harvests';

export const CropCalendar = () => {
  const params = useParams();
  const farmerId = String(params.farmerId);
  const fieldId = String(params.fieldId);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // month, year, list
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterField, setFilterField] = useState('all');

  useEffect(() => {
    if (!fieldId) return;
    const ac = new AbortController();

    (async () => {
      try {
        const data = await getHarvestsByField(String(fieldId), {
          signal: ac.signal,
        });
        if (ac.signal.aborted) return;
        console.log('Données reçues:', data);
        setCropsData(data as any[]);
      } catch (err) {
        if (!ac.signal.aborted) console.error('Erreur fetch:', err);
      }
    })();

    return () => ac.abort();
  }, [fieldId]);

  // Vos vraies données complètes avec toutes les informations
  const [cropsData, setCropsData] = useState([]);

  // Configuration des cultures avec couleurs
  const cropConfig = {
    oignon: {
      color: 'bg-purple-500',
      textColor: 'text-white',
      icon: '🧅',
      family: 'Alliacées',
    },
    arachide: {
      color: 'bg-red-500',
      textColor: 'text-white',
      icon: '🥜',
      family: 'Légumineuses',
    },
    ble: {
      color: 'bg-yellow-600',
      textColor: 'text-white',
      icon: '🌾',
      family: 'Graminées',
    },
    mais: {
      color: 'bg-yellow-500',
      textColor: 'text-white',
      icon: '🌽',
      family: 'Graminées',
    },
    tomate: {
      color: 'bg-red-600',
      textColor: 'text-white',
      icon: '🍅',
      family: 'Solanacées',
    },
    riz: {
      color: 'bg-green-500',
      textColor: 'text-white',
      icon: '🌾',
      family: 'Graminées',
    },
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const getUniqueFiields = () => {
    const fieldsMap = new Map();
    cropsData.forEach((crop) => {
      if (crop.field && crop.field.id) {
        fieldsMap.set(crop.field.id, crop.field);
      }
    });
    return Array.from(fieldsMap.values());
  };

  // Générer les jours du mois avec les cultures
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Commencer dimanche

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      // 6 semaines x 7 jours
      const dayKey = current.toISOString().split('T')[0];
      const dayNumber = current.getDate();
      const isCurrentMonth = current.getMonth() === month;
      const isToday = current.toDateString() === new Date().toDateString();

      // Trouver les cultures actives ce jour
      const activeCrops = cropsData.filter((crop) => {
        if (filterField !== 'all' && crop.field.id !== filterField)
          return false;

        const plantDate = new Date(crop.plantingDate);
        const harvestDate = new Date(crop.harvestDate);
        return current >= plantDate && current <= harvestDate;
      });

      days.push({
        date: new Date(current),
        dayNumber,
        isCurrentMonth,
        isToday,
        activeCrops,
        dayKey,
      });

      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  // Navigation dans le calendrier
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Vue calendrier mensuel
  const MonthView = () => {
    const days = generateCalendarDays();
    const monthName = currentDate.toLocaleDateString('fr-FR', {
      month: 'long',
      year: 'numeric',
    });
    const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

    return (
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        {/* En-tête du calendrier */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold capitalize">{monthName}</h2>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={goToToday}
                className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                Aujourd'hui
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter
              </button>
            </div>
          </div>
        </div>

        {/* Jours de la semaine */}
        <div className="grid grid-cols-7 bg-gray-100 border-b">
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-4 text-center font-semibold text-gray-700 border-r last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Grille du calendrier */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => (
            <div
              key={index}
              className={`min-h-32 border-r border-b last:border-r-0 p-2 ${
                !day.isCurrentMonth ? 'bg-gray-50' : 'bg-white'
              } ${
                day.isToday ? 'bg-blue-50 border-blue-200' : ''
              } hover:bg-gray-50 transition-colors`}
            >
              {/* Numéro du jour */}
              <div
                className={`text-sm font-medium mb-2 ${
                  day.isToday
                    ? 'text-blue-600'
                    : day.isCurrentMonth
                    ? 'text-gray-900'
                    : 'text-gray-400'
                }`}
              >
                {day.dayNumber}
              </div>

              {/* Cultures actives */}
              <div className="space-y-1">
                {day.activeCrops.slice(0, 3).map((crop, cropIndex) => {
                  const config = cropConfig[crop.cropType] || {
                    color: 'bg-gray-500',
                    icon: '🌱',
                  };
                  const isPlantingDay =
                    day.date.toDateString() ===
                    new Date(crop.plantingDate).toDateString();
                  const isHarvestDay =
                    day.date.toDateString() ===
                    new Date(crop.harvestDate).toDateString();

                  return (
                    <div
                      key={crop.id}
                      onClick={() => setSelectedCrop(crop)}
                      className={`${config.color} ${config.textColor} px-2 py-1 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="mr-1">{config.icon}</span>
                          <span className="font-medium truncate">
                            {crop.cropType}
                          </span>
                        </div>
                        <div className="flex text-xs">
                          {isPlantingDay && <span>🌱</span>}
                          {isHarvestDay && <span>🌾</span>}
                        </div>
                      </div>
                      <div className="text-xs opacity-75 truncate mt-1">
                        {crop.field.name} • {crop.surfaceArea}ha
                      </div>
                    </div>
                  );
                })}

                {day.activeCrops.length > 3 && (
                  <div className="text-xs text-gray-500 text-center py-1">
                    +{day.activeCrops.length - 3} autres
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Vue liste
  const ListView = () => {
    const sortedCrops = [...cropsData].sort(
      (a, b) => new Date(b.plantingDate) - new Date(a.plantingDate)
    );

    return (
      <div className="space-y-4">
        {sortedCrops.map((crop) => {
          const config = cropConfig[crop.cropType] || {
            color: 'bg-gray-500',
            icon: '🌱',
          };
          const plantDate = new Date(crop.plantingDate);
          const harvestDate = new Date(crop.harvestDate);
          const isActive = new Date() >= plantDate && new Date() <= harvestDate;
          const isCompleted = new Date() > harvestDate;

          // Calcul complet des coûts avec eau
          const waterCost = parseInt(crop.waterCost) || 0;
          const totalRealCosts = (crop.totalCost || 0) + waterCost;
          const profit = (crop.yieldFCFA || 0) - totalRealCosts;

          return (
            <div
              key={crop.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div
                    className={`${config.color} ${config.textColor} w-16 h-16 rounded-xl flex items-center justify-center text-2xl`}
                  >
                    {config.icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 capitalize">
                        {crop.cropType}
                      </h3>
                      {crop.variety && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {crop.variety}
                        </span>
                      )}
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          isActive
                            ? 'bg-green-100 text-green-800'
                            : isCompleted
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {isActive
                          ? 'En cours'
                          : isCompleted
                          ? 'Terminé'
                          : 'Planifié'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {crop.field.name}
                      </div>
                      <div className="flex items-center">
                        <Target className="w-4 h-4 mr-1" />
                        {crop.surfaceArea} ha
                        {crop.zone && crop.zonePercent && (
                          <span className="ml-1 text-xs">
                            ({crop.zone} {crop.zonePercent}%)
                          </span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {plantDate.toLocaleDateString('fr-FR')}
                      </div>
                      <div className="flex items-center">
                        <Leaf className="w-4 h-4 mr-1" />
                        {harvestDate.toLocaleDateString('fr-FR')}
                      </div>
                    </div>

                    {/* Informations techniques */}
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                      <div className="flex items-center">
                        <Droplets className="w-3 h-3 mr-1" />
                        {crop.irrigationType}
                      </div>
                      <div className="flex items-center">
                        <BarChart3 className="w-3 h-3 mr-1" />
                        Qualité: {crop.harvestQuality}
                      </div>
                      {crop.waterCost && (
                        <div className="flex items-center">
                          💧 Eau: {formatNumber(crop.waterCost)} FCFA
                        </div>
                      )}
                    </div>

                    {/* Données économiques */}
                    <div className="flex items-center space-x-6">
                      <div className="text-sm">
                        <span className="text-gray-600">Rendement: </span>
                        <span className="font-semibold">
                          {crop.yieldTonnes} tonnes
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Revenus: </span>
                        <span className="font-semibold text-green-600">
                          {formatNumber(crop.yieldFCFA || 0)} FCFA
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Coûts totaux: </span>
                        <span className="font-semibold text-red-600">
                          {formatNumber(totalRealCosts)} FCFA
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Bénéfice: </span>
                        <span
                          className={`font-semibold ${
                            profit >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {profit >= 0 ? '+' : ''}
                          {formatNumber(profit)} FCFA
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedCrop(crop)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Modal de détails de culture
  const CropDetailModal = () => {
    if (!selectedCrop) return null;

    const config = cropConfig[selectedCrop.cropType] || {
      color: 'bg-gray-500',
      icon: '🌱',
    };
    const waterCost = parseInt(selectedCrop.waterCost) || 0;
    const totalRealCosts = (selectedCrop.totalCost || 0) + waterCost;
    const profit = (selectedCrop.yieldFCFA || 0) - totalRealCosts;
    const plantDate = new Date(selectedCrop.plantingDate);
    const harvestDate = new Date(selectedCrop.harvestDate);
    const duration = Math.ceil(
      (harvestDate - plantDate) / (1000 * 60 * 60 * 24)
    );

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-8">
            {/* En-tête */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-start space-x-4">
                <div
                  className={`${config.color} ${config.textColor} w-20 h-20 rounded-2xl flex items-center justify-center text-3xl`}
                >
                  {config.icon}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 capitalize">
                    {selectedCrop.cropType}
                  </h2>
                  {selectedCrop.variety && (
                    <p className="text-lg text-blue-600 font-medium mt-1">
                      Variété: {selectedCrop.variety}
                    </p>
                  )}
                  <p className="text-xl text-gray-600 mt-1">
                    {selectedCrop.field.name}
                  </p>
                  <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Target className="w-4 h-4 mr-1" />
                      {selectedCrop.surfaceArea} hectares
                      {selectedCrop.zone && selectedCrop.zonePercent && (
                        <span className="ml-1">
                          ({selectedCrop.zone} - {selectedCrop.zonePercent}%)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {duration} jours
                    </div>
                    <div className="flex items-center">
                      <BarChart3 className="w-4 h-4 mr-1" />
                      {selectedCrop.harvestQuality || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedCrop(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Informations générales */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Planning Cultural
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Sprout className="w-5 h-5 text-green-600 mr-3" />
                        <span className="text-gray-700">Plantation</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {plantDate.toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Leaf className="w-5 h-5 text-orange-600 mr-3" />
                        <span className="text-gray-700">Récolte</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {harvestDate.toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Droplets className="w-5 h-5 text-blue-600 mr-3" />
                        <span className="text-gray-700">Irrigation</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {selectedCrop.irrigationType || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Informations du champ */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Caractéristiques du Champ
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Surface totale:</span>
                      <div className="font-semibold">
                        {selectedCrop.field.size} ha
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Type de sol:</span>
                      <div className="font-semibold">
                        {selectedCrop.field.soilType}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Drainage:</span>
                      <div className="font-semibold">
                        {selectedCrop.field.drainage || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">pH du sol:</span>
                      <div className="font-semibold">
                        {selectedCrop.field.soilPH || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Données économiques */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Analyse Économique
                </h3>

                {/* Coûts */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Coûts de Production
                  </h4>
                  <div className="space-y-3">
                    {selectedCrop.seedCost && (
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <span className="text-gray-700">Semences</span>
                        <span className="font-semibold text-red-600">
                          {formatNumber(selectedCrop.seedCost)} FCFA
                        </span>
                      </div>
                    )}
                    {selectedCrop.laborCost && (
                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <span className="text-gray-700">Main d'œuvre</span>
                        <span className="font-semibold text-orange-600">
                          {formatNumber(selectedCrop.laborCost)} FCFA
                        </span>
                      </div>
                    )}
                    {selectedCrop.inputCost && (
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-gray-700">Intrants</span>
                        <span className="font-semibold text-blue-600">
                          {formatNumber(selectedCrop.inputCost)} FCFA
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg border-2 border-gray-300">
                      <span className="font-semibold text-gray-800">
                        Total Coûts
                      </span>
                      <span className="font-bold text-xl text-red-600">
                        {formatNumber(selectedCrop.totalCost || 0)} FCFA
                      </span>
                    </div>
                  </div>
                </div>

                {/* Revenus */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Rendement et Revenus
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-700">Rendement</span>
                      <span className="font-semibold text-green-600">
                        {selectedCrop.yieldTonnes} tonnes
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                      <span className="text-gray-700">Revenus totaux</span>
                      <span className="font-bold text-xl text-green-600">
                        {formatNumber(selectedCrop.yieldFCFA || 0)} FCFA
                      </span>
                    </div>
                    <div
                      className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                        profit >= 0
                          ? 'bg-green-100 border-green-300'
                          : 'bg-red-100 border-red-300'
                      }`}
                    >
                      <span className="font-bold text-gray-800">
                        Bénéfice Net
                      </span>
                      <span
                        className={`font-bold text-2xl ${
                          profit >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {profit >= 0 ? '+' : ''}
                        {formatNumber(profit)} FCFA
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Problèmes et notes */}
            {(selectedCrop.problemsEncountered || selectedCrop.notes) && (
              <div className="mt-8 space-y-4">
                {selectedCrop.problemsEncountered && (
                  <div className="bg-orange-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                      Problèmes Rencontrés
                    </h3>
                    <p className="text-gray-700">
                      {selectedCrop.problemsEncountered}
                    </p>
                  </div>
                )}

                {selectedCrop.notes && (
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Notes
                    </h3>
                    <p className="text-gray-700">{selectedCrop.notes}</p>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
              <button
                onClick={() => setSelectedCrop(null)}
                className="px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Fermer
              </button>
              <button className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Edit3 className="w-5 h-5 mr-2" />
                Modifier
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 rounded-3xl">
      <div className="max-w-7xl mx-auto p-6">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Calendrier des Cultures
            </h1>
            <p className="text-gray-600 text-lg">
              Suivez vos plantations et récoltes dans le temps
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Filtre par champ */}
            <select
              value={filterField}
              onChange={(e) => setFilterField(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Tous les champs</option>
              {getUniqueFiields().map((field) => (
                <option key={field.id} value={field.id}>
                  {field.name}
                </option>
              ))}
            </select>

            {/* Mode d'affichage */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('month')}
                className={`px-4 py-2 rounded-md transition-colors flex items-center ${
                  viewMode === 'month'
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600'
                }`}
              >
                <Grid className="w-4 h-4 mr-2" />
                Calendrier
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md transition-colors flex items-center ${
                  viewMode === 'list'
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600'
                }`}
              >
                <List className="w-4 h-4 mr-2" />
                Liste
              </button>
            </div>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cultures Actives</p>
                <p className="text-2xl font-bold text-green-600">
                  {
                    cropsData.filter((crop) => {
                      const now = new Date();
                      return (
                        now >= new Date(crop.plantingDate) &&
                        now <= new Date(crop.harvestDate)
                      );
                    }).length
                  }
                </p>
              </div>
              <Sprout className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Surface Cultivée</p>
                <p className="text-2xl font-bold text-blue-600">
                  {cropsData
                    .reduce((sum, crop) => sum + crop.surfaceArea, 0)
                    .toFixed(1)}{' '}
                  ha
                </p>
              </div>
              <Target className="w-12 h-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenus Totaux</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatNumber(
                    cropsData.reduce(
                      (sum, crop) => sum + (crop.yieldFCFA || 0),
                      0
                    )
                  )}{' '}
                  FCFA
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bénéfice Net</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatNumber(
                    cropsData.reduce((sum, crop) => {
                      const waterCost = parseInt(crop.waterCost) || 0;
                      const totalCosts = (crop.totalCost || 0) + waterCost;
                      return sum + ((crop.yieldFCFA || 0) - totalCosts);
                    }, 0)
                  )}{' '}
                  FCFA
                </p>
              </div>
              <BarChart3 className="w-12 h-12 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        {viewMode === 'month' ? <MonthView /> : <ListView />}
      </div>

      <CropDetailModal />
    </div>
  );
};

export default CropCalendar;
