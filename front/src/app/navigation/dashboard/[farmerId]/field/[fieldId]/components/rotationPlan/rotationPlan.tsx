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
  FileText,
  Beaker,
  Layers,
  Sun,
  Thermometer,
  Cloud,
  Timer,
  Wheat,
  Shield,
  Activity,
  TrendingUp,
} from 'lucide-react';
import { getHarvestsByField } from '../../../../../../../../../api/harvests';

export const CropCalendarComponent = () => {
  const params = useParams();
  const farmerId = String(params.farmerId);
  const fieldId = String(params.fieldId);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // month, year, list
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterField, setFilterField] = useState('all');
  const [harvests, setHarvests] = useState([]);

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
        setHarvests(data as any[]);
      } catch (err) {
        if (!ac.signal.aborted) console.error('Erreur fetch:', err);
      }
    })();

    return () => ac.abort();
  }, [fieldId]);

  // Vos vraies données complètes avec toutes les informations

  // Configuration des cultures avec couleurs
  const cropConfig = {
    // 🌾 CÉRÉALES
    riz: {
      color: 'bg-green-500',
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
    ble: {
      color: 'bg-yellow-600',
      textColor: 'text-white',
      icon: '🌾',
      family: 'Graminées',
    },
    orge: {
      color: 'bg-amber-600',
      textColor: 'text-white',
      icon: '🌾',
      family: 'Graminées',
    },
    millet: {
      color: 'bg-lime-600',
      textColor: 'text-white',
      icon: '🌾',
      family: 'Graminées',
    },
    sorgho: {
      color: 'bg-red-400',
      textColor: 'text-white',
      icon: '🌾',
      family: 'Graminées',
    },
    avoine: {
      color: 'bg-emerald-600',
      textColor: 'text-white',
      icon: '🌾',
      family: 'Graminées',
    },
    seigle: {
      color: 'bg-teal-600',
      textColor: 'text-white',
      icon: '🌾',
      family: 'Graminées',
    },

    // 🫘 LÉGUMINEUSES
    arachide: {
      color: 'bg-red-500',
      textColor: 'text-white',
      icon: '🥜',
      family: 'Légumineuses',
    },
    soja: {
      color: 'bg-green-700',
      textColor: 'text-white',
      icon: '🌱',
      family: 'Légumineuses',
    },
    haricot: {
      color: 'bg-rose-500',
      textColor: 'text-white',
      icon: '🫘',
      family: 'Légumineuses',
    },
    pois: {
      color: 'bg-green-500',
      textColor: 'text-white',
      icon: '🟢',
      family: 'Légumineuses',
    },
    lentille: {
      color: 'bg-orange-500',
      textColor: 'text-white',
      icon: '🔴',
      family: 'Légumineuses',
    },
    feve: {
      color: 'bg-stone-500',
      textColor: 'text-white',
      icon: '🫘',
      family: 'Légumineuses',
    },
    niebe: {
      color: 'bg-indigo-500',
      textColor: 'text-white',
      icon: '🫘',
      family: 'Légumineuses',
    },

    // 🌻 OLÉAGINEUX / INDUSTRIELS
    coton: {
      color: 'bg-green-800',
      textColor: 'text-white',
      icon: '🌿',
      family: 'Malvacées',
    },
    colza: {
      color: 'bg-yellow-400',
      textColor: 'text-black',
      icon: '🌼',
      family: 'Brassicacées',
    },
    tournesol: {
      color: 'bg-yellow-300',
      textColor: 'text-black',
      icon: '🌻',
      family: 'Astéracées',
    },
    palme: {
      color: 'bg-emerald-800',
      textColor: 'text-white',
      icon: '🌴',
      family: 'Palmiers',
    },
    sesame: {
      color: 'bg-gray-400',
      textColor: 'text-black',
      icon: '⚪',
      family: 'Pédaliacées',
    },
    ricin: {
      color: 'bg-red-700',
      textColor: 'text-white',
      icon: '🌿',
      family: 'Euphorbiacées',
    },

    // 🍠 TUBERCULES & RACINES
    igname: {
      color: 'bg-purple-700',
      textColor: 'text-white',
      icon: '🍠',
      family: 'Dioscoréacées',
    },
    manioc: {
      color: 'bg-amber-700',
      textColor: 'text-white',
      icon: '🥔',
      family: 'Euphorbiacées',
    },
    patateDouce: {
      color: 'bg-orange-600',
      textColor: 'text-white',
      icon: '🍠',
      family: 'Convolvulacées',
    },
    pommeDeTerre: {
      color: 'bg-yellow-700',
      textColor: 'text-white',
      icon: '🥔',
      family: 'Solanacées',
    },
    taro: {
      color: 'bg-teal-700',
      textColor: 'text-white',
      icon: '🌿',
      family: 'Aracées',
    },

    // 🥬 LÉGUMES
    tomate: {
      color: 'bg-red-600',
      textColor: 'text-white',
      icon: '🍅',
      family: 'Solanacées',
    },
    oignon: {
      color: 'bg-purple-500',
      textColor: 'text-white',
      icon: '🧅',
      family: 'Alliacées',
    },
    ail: {
      color: 'bg-gray-500',
      textColor: 'text-white',
      icon: '🧄',
      family: 'Alliacées',
    },
    piment: {
      color: 'bg-red-500',
      textColor: 'text-white',
      icon: '🌶️',
      family: 'Solanacées',
    },
    poivron: {
      color: 'bg-green-600',
      textColor: 'text-white',
      icon: '🫑',
      family: 'Solanacées',
    },
    concombre: {
      color: 'bg-green-400',
      textColor: 'text-black',
      icon: '🥒',
      family: 'Cucurbitacées',
    },
    carotte: {
      color: 'bg-orange-500',
      textColor: 'text-white',
      icon: '🥕',
      family: 'Apiacées',
    },
    chou: {
      color: 'bg-green-700',
      textColor: 'text-white',
      icon: '🥬',
      family: 'Brassicacées',
    },
    laitue: {
      color: 'bg-lime-500',
      textColor: 'text-black',
      icon: '🥗',
      family: 'Astéracées',
    },
    gombo: {
      color: 'bg-emerald-600',
      textColor: 'text-white',
      icon: '🌿',
      family: 'Malvacées',
    },
    courgette: {
      color: 'bg-green-500',
      textColor: 'text-white',
      icon: '🥒',
      family: 'Cucurbitacées',
    },
    aubergine: {
      color: 'bg-purple-600',
      textColor: 'text-white',
      icon: '🍆',
      family: 'Solanacées',
    },

    // 🍎 FRUITS
    banane: {
      color: 'bg-yellow-400',
      textColor: 'text-black',
      icon: '🍌',
      family: 'Musacées',
    },
    mangue: {
      color: 'bg-orange-400',
      textColor: 'text-black',
      icon: '🥭',
      family: 'Anacardiacées',
    },
    orange: {
      color: 'bg-orange-500',
      textColor: 'text-white',
      icon: '🍊',
      family: 'Rutacées',
    },
    citron: {
      color: 'bg-yellow-300',
      textColor: 'text-black',
      icon: '🍋',
      family: 'Rutacées',
    },
    ananas: {
      color: 'bg-yellow-500',
      textColor: 'text-black',
      icon: '🍍',
      family: 'Broméliacées',
    },
    pasteque: {
      color: 'bg-red-500',
      textColor: 'text-white',
      icon: '🍉',
      family: 'Cucurbitacées',
    },
    melon: {
      color: 'bg-amber-400',
      textColor: 'text-black',
      icon: '🍈',
      family: 'Cucurbitacées',
    },
    pomme: {
      color: 'bg-red-500',
      textColor: 'text-white',
      icon: '🍎',
      family: 'Rosacées',
    },
    poire: {
      color: 'bg-green-400',
      textColor: 'text-black',
      icon: '🍐',
      family: 'Rosacées',
    },
    fraise: {
      color: 'bg-pink-500',
      textColor: 'text-white',
      icon: '🍓',
      family: 'Rosacées',
    },
    raisin: {
      color: 'bg-purple-600',
      textColor: 'text-white',
      icon: '🍇',
      family: 'Vitacées',
    },
    avocat: {
      color: 'bg-green-700',
      textColor: 'text-white',
      icon: '🥑',
      family: 'Lauracées',
    },
    papaye: {
      color: 'bg-orange-600',
      textColor: 'text-white',
      icon: '🥭',
      family: 'Caricacées',
    },
    cajou: {
      color: 'bg-yellow-800',
      textColor: 'text-white',
      icon: '🌰',
      family: 'Anacardiacées',
    },
    coco: {
      color: 'bg-amber-700',
      textColor: 'text-white',
      icon: '🥥',
      family: 'Palmiers',
    },
    cafe: {
      color: 'bg-brown-700',
      textColor: 'text-white',
      icon: '☕',
      family: 'Rubiacées',
    },
    cacao: {
      color: 'bg-amber-800',
      textColor: 'text-white',
      icon: '🍫',
      family: 'Malvacées',
    },

    // 🌿 AROMATIQUES / MÉDICINALES
    basilic: {
      color: 'bg-green-500',
      textColor: 'text-white',
      icon: '🌿',
      family: 'Lamiacées',
    },
    menthe: {
      color: 'bg-emerald-500',
      textColor: 'text-white',
      icon: '🌿',
      family: 'Lamiacées',
    },
    thym: {
      color: 'bg-gray-600',
      textColor: 'text-white',
      icon: '🌿',
      family: 'Lamiacées',
    },
    romarin: {
      color: 'bg-teal-600',
      textColor: 'text-white',
      icon: '🌿',
      family: 'Lamiacées',
    },
    gingembre: {
      color: 'bg-orange-500',
      textColor: 'text-white',
      icon: '🫚',
      family: 'Zingibéracées',
    },
    curcuma: {
      color: 'bg-yellow-600',
      textColor: 'text-white',
      icon: '🟠',
      family: 'Zingibéracées',
    },

    // 📦 AUTRE
    autre: {
      color: 'bg-gray-400',
      textColor: 'text-black',
      icon: '📦',
      family: 'Divers',
    },
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const dayData = {
        date: date,
        dayNumber: date.getDate(),
        isCurrentMonth: date.getMonth() === month,
        isToday: date.toDateString() === today.toDateString(),
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        activeCrops: [],
        events: [],
      };

      // Vérifier les cultures actives pour ce jour
      harvests.forEach((crop) => {
        const plantDate = new Date(crop.plantingDate);
        const harvestDate = new Date(crop.harvestDate);

        if (date >= plantDate && date <= harvestDate) {
          const totalDays = Math.ceil(
            (harvestDate - plantDate) / (1000 * 60 * 60 * 24)
          );
          const currentDay = Math.ceil(
            (date - plantDate) / (1000 * 60 * 60 * 24)
          );
          const progress = (currentDay / totalDays) * 100;

          dayData.activeCrops.push({
            ...crop,
            progress: progress,
            currentPhase: getGrowthPhase(progress),
            daysRemaining: Math.ceil(
              (harvestDate - date) / (1000 * 60 * 60 * 24)
            ),
          });
        }

        // Ajouter les événements spéciaux
        if (date.toDateString() === plantDate.toDateString()) {
          dayData.events.push({ type: 'planting', crop: crop });
        }
        if (date.toDateString() === harvestDate.toDateString()) {
          dayData.events.push({ type: 'harvest', crop: crop });
        }
      });

      days.push(dayData);
    }

    return days;
  };

  // Déterminer la phase de croissance
  const getGrowthPhase = (progress) => {
    if (progress < 25) return 'Germination';
    if (progress < 50) return 'Croissance';
    if (progress < 75) return 'Floraison';
    return 'Maturation';
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
    const weekDays = [
      'Dimanche',
      'Lundi',
      'Mardi',
      'Mercredi',
      'Jeudi',
      'Vendredi',
      'Samedi',
    ];

    return (
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* En-tête du calendrier */}
        <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>

              <div>
                <h2 className="text-3xl font-bold text-white capitalize">
                  {monthName}
                </h2>
                <p className="text-green-100 text-sm mt-1">
                  Calendrier des cultures
                </p>
              </div>

              <button
                onClick={() => navigateMonth(1)}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex bg-white/20 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('month')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    viewMode === 'month'
                      ? 'bg-white text-green-600'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  Mois
                </button>
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    viewMode === 'week'
                      ? 'bg-white text-green-600'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  Semaine
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    viewMode === 'list'
                      ? 'bg-white text-green-600'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  Liste
                </button>
              </div>

              <button
                onClick={goToToday}
                className="px-6 py-2.5 bg-white text-green-600 rounded-xl hover:bg-green-50 transition-all duration-200 font-medium"
              >
                Aujourd'hui
              </button>
            </div>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/20 backdrop-blur rounded-xl p-3">
              <div className="flex items-center justify-between">
                <Sprout className="w-5 h-5 text-white/80" />
                <span className="text-2xl font-bold text-white">
                  {harvests.length}
                </span>
              </div>
              <p className="text-white/80 text-sm mt-1">Cultures actives</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl p-3">
              <div className="flex items-center justify-between">
                <MapPin className="w-5 h-5 text-white/80" />
                <span className="text-2xl font-bold text-white">
                  {harvests.reduce((acc, h) => acc + h.field.size, 0)} ha
                </span>
              </div>
              <p className="text-white/80 text-sm mt-1">Surface totale</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl p-3">
              <div className="flex items-center justify-between">
                <TrendingUp className="w-5 h-5 text-white/80" />
                <span className="text-2xl font-bold text-white">
                  {(
                    harvests.reduce((acc, h) => acc + h.yieldTonnes, 0) /
                    harvests.reduce((acc, h) => acc + h.field.size, 0)
                  ).toFixed(1)}{' '}
                  T/ha
                </span>
              </div>
              <p className="text-white/80 text-sm mt-1">Rendement moyen</p>
            </div>
          </div>
        </div>

        {/* Jours de la semaine */}
        <div className="grid grid-cols-7 bg-gradient-to-b from-gray-50 to-gray-100 border-b border-gray-200">
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-4 text-center font-semibold text-gray-700 text-sm uppercase tracking-wider border-r last:border-r-0 border-gray-200"
            >
              {day.substring(0, 3)}
            </div>
          ))}
        </div>

        {/* Grille du calendrier */}
        <div className="grid grid-cols-7 bg-gray-50">
          {days.map((day, index) => (
            <div
              key={index}
              className={`min-h-36 border-r border-b border-gray-200 last:border-r-0 p-2 transition-all duration-200 ${
                !day.isCurrentMonth ? 'bg-gray-50/50' : 'bg-white'
              } ${
                day.isToday ? 'bg-blue-50 ring-2 ring-blue-400 ring-inset' : ''
              } 
              ${day.isWeekend ? 'bg-gray-50' : ''}
              hover:bg-gray-50 cursor-pointer`}
            >
              {/* En-tête du jour */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-sm font-bold ${
                    day.isToday
                      ? 'text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full'
                      : day.isCurrentMonth
                      ? 'text-gray-900'
                      : 'text-gray-400'
                  }`}
                >
                  {day.dayNumber}
                </span>

                {/* Indicateurs d'événements */}
                <div className="flex gap-1">
                  {day.events.map((event, idx) => (
                    <span
                      key={idx}
                      className="text-xs"
                      title={`${
                        event.type === 'planting' ? 'Plantation' : 'Récolte'
                      } - ${event.crop.cropType}`}
                    >
                      {event.type === 'planting' ? '🌱' : '🌾'}
                    </span>
                  ))}
                </div>
              </div>

              {/* Cultures actives */}
              <div className="space-y-1">
                {day.activeCrops
                  .filter((m) => m?.isEnd === false)
                  .slice(0, 10)
                  .map((crop) => {
                    const config = cropConfig[crop.cropType] || {
                      color: 'bg-gray-500',
                      icon: '🌱',
                    };

                    return (
                      <div
                        key={crop.id}
                        onClick={() => setSelectedCrop(crop)}
                        className={`group relative ${config.color} ${config.textColor} px-2 py-1.5 rounded-lg text-xs cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-105`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="text-sm">{config.icon}</span>
                            <span className="font-semibold">
                              {crop.cropType}
                            </span>
                          </div>
                          <span className="text-xs opacity-90">
                            {crop.field.size}ha
                          </span>
                        </div>

                        {/* Barre de progression */}
                        <div className="mt-1 bg-white/30 rounded-full h-1 overflow-hidden">
                          <div
                            className="h-full bg-white/80 rounded-full transition-all duration-300"
                            style={{ width: `${crop.progress}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs opacity-75">
                            {crop.currentPhase}
                          </span>
                          <span className="text-xs opacity-75">
                            J-{crop.daysRemaining}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Modal de détails de culture professionnelle
  const CropDetailModal = () => {
    if (!selectedCrop) return null;

    const config = cropConfig[selectedCrop.cropType] || {
      color: 'bg-gray-500',
      icon: '🌱',
    };
    const plantDate = new Date(selectedCrop.plantingDate);
    const harvestDate = new Date(selectedCrop.harvestDate);
    const duration = Math.ceil(
      (harvestDate - plantDate) / (1000 * 60 * 60 * 24)
    );
    const yieldPerHa = (
      selectedCrop.yieldTonnes / selectedCrop.field.size
    ).toFixed(2);

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
          {/* En-tête de la modal */}
          <div
            className={`bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 p-8 text-white`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-6">
                <div className="bg-white/20 backdrop-blur w-24 h-24 rounded-2xl flex items-center justify-center text-5xl">
                  {config.icon}
                </div>
                <div>
                  <h2 className="text-4xl font-bold capitalize mb-2">
                    {selectedCrop.cropType}
                  </h2>
                  <p className="text-xl text-green-100 mb-1">
                    Variété: {selectedCrop.variety}
                  </p>
                  <p className="text-lg text-green-100">
                    {selectedCrop.field.name} • {selectedCrop.zone.name}
                  </p>

                  <div className="flex flex-wrap gap-3 mt-4">
                    <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      {selectedCrop.field.size} hectares
                    </span>
                    <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {duration} jours
                    </span>
                    <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm">
                      <Wheat className="w-4 h-4 inline mr-1" />
                      {yieldPerHa} T/ha
                    </span>
                    <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm capitalize">
                      <Shield className="w-4 h-4 inline mr-1" />
                      Qualité {selectedCrop.harvestQuality}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedCrop(null)}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Corps de la modal */}
          <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Section Planning Cultural */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                    Planning Cultural
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                      <div className="flex items-center">
                        <Sprout className="w-5 h-5 text-green-600 mr-3" />
                        <span className="text-gray-700">Plantation</span>
                      </div>
                      <span className="font-bold text-gray-900">
                        {plantDate.toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                      <div className="flex items-center">
                        <Wheat className="w-5 h-5 text-amber-600 mr-3" />
                        <span className="text-gray-700">Récolte prévue</span>
                      </div>
                      <span className="font-bold text-gray-900">
                        {harvestDate.toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                      <div className="flex items-center">
                        <Timer className="w-5 h-5 text-purple-600 mr-3" />
                        <span className="text-gray-700">Durée du cycle</span>
                      </div>
                      <span className="font-bold text-gray-900">
                        {duration} jours
                      </span>
                    </div>
                  </div>
                </div>

                {/* Conditions météo */}
                {selectedCrop.weatherConditions && (
                  <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-6 border border-sky-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <Cloud className="w-5 h-5 mr-2 text-sky-600" />
                      Conditions Météorologiques
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                        <div className="flex items-center">
                          <Thermometer className="w-5 h-5 text-red-500 mr-2" />
                          <span className="text-gray-700">
                            Température moy.
                          </span>
                        </div>
                        <span className="font-bold">
                          {selectedCrop.weatherConditions.avgTemp}°C
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                        <div className="flex items-center">
                          <Droplets className="w-5 h-5 text-blue-500 mr-2" />
                          <span className="text-gray-700">Pluviométrie</span>
                        </div>
                        <span className="font-bold">
                          {selectedCrop.weatherConditions.rainfall} mm
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                        <div className="flex items-center">
                          <Sun className="w-5 h-5 text-yellow-500 mr-2" />
                          <span className="text-gray-700">Ensoleillement</span>
                        </div>
                        <span className="font-bold">
                          {selectedCrop.weatherConditions.sunHours} h
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Section Caractéristiques du Champ */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Layers className="w-5 h-5 mr-2 text-green-600" />
                    Caractéristiques du Champ
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-1">
                        Surface totale
                      </p>
                      <p className="font-bold text-gray-900">
                        {selectedCrop.field.size} ha
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-1">Type de sol</p>
                      <p className="font-bold text-gray-900">
                        {selectedCrop.field.soilType}
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-1">pH du sol</p>
                      <p className="font-bold text-gray-900">
                        {selectedCrop.field.soilPH}
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-1">Drainage</p>
                      <p className="font-bold text-gray-900">
                        {selectedCrop.field.drainage}
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-1">Altitude</p>
                      <p className="font-bold text-gray-900">
                        {selectedCrop.field.altitude} m
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-1">Exposition</p>
                      <p className="font-bold text-gray-900">
                        {selectedCrop.field.exposition}
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-3 col-span-2">
                      <p className="text-xs text-gray-500 mb-1">
                        Système d'irrigation
                      </p>
                      <p className="font-bold text-gray-900">
                        {selectedCrop.field.irrigationSystem}
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-3 col-span-2">
                      <p className="text-xs text-gray-500 mb-1">
                        Matière organique
                      </p>
                      <p className="font-bold text-gray-900">
                        {selectedCrop.field.organicMatter}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Intrants utilisés */}
                {selectedCrop.pesticidesUsed && (
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <Beaker className="w-5 h-5 mr-2 text-purple-600" />
                      Intrants & Traitements
                    </h3>
                    <div className="bg-white rounded-xl p-4">
                      <p className="text-gray-700 leading-relaxed">
                        {selectedCrop.pesticidesUsed}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Section Performance & Économie */}
              <div className="space-y-6">
                {/* Performance */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-amber-600" />
                    Performance
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-white rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">Rendement total</span>
                        <span className="text-2xl font-bold text-gray-900">
                          {selectedCrop.yieldTonnes} T
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Rendement/hectare</span>
                        <span className="text-xl font-bold text-green-600">
                          {yieldPerHa} T/ha
                        </span>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">
                          Qualité de récolte
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-bold capitalize ${
                            selectedCrop.harvestQuality === 'excellente'
                              ? 'bg-green-100 text-green-800'
                              : selectedCrop.harvestQuality === 'bonne'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {selectedCrop.harvestQuality}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Problèmes et notes */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {selectedCrop.problemsEncountered && (
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                    Problèmes Rencontrés
                  </h3>
                  <div className="bg-white rounded-xl p-4">
                    <p className="text-gray-700 leading-relaxed">
                      {selectedCrop.problemsEncountered}
                    </p>
                  </div>
                </div>
              )}

              {selectedCrop.notes && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                    Notes & Observations
                  </h3>
                  <div className="bg-white rounded-xl p-4">
                    <p className="text-gray-700 leading-relaxed">
                      {selectedCrop.notes}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setSelectedCrop(null)}
                className="px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-3xl">
      <div className="max-w-7xl mx-auto p-6">
        {/* Contenu principal */}
        {<MonthView />}
      </div>

      <CropDetailModal />
    </div>
  );
};

export default CropCalendarComponent;
