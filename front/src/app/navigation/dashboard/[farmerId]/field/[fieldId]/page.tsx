'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Droplets,
  Leaf,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Thermometer,
  DollarSign,
  Cloud,
  CloudRain,
  Wind,
  Users,
  Sprout,
  BarChart3,
  Gauge,
  Info,
  Download,
  Satellite,
  Award,
  Scale,
  Edit,
  Trash2,
  Wheat,
  ChevronUp,
  ChevronDown,
  CalendarCheck,
  AlertCircle,
  TimerOff,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

import ActionsDropdown from './components/actionsDropdown/actionsDropdown';
import { ExpandableText } from './components/expandableText/expandableText';
import CropCalendarComponent from './components/rotationPlan/rotationPlan';
import TeamMembersDisplay from './components/membersHere/memberHere';
import RenderActivities from './components/showActivities/showActivities';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import AddMemberModal from './components/addMembers/addMembers';
import { getFarmerById } from '../../../../../../../api/farmer';
import { getZoneById, getZonesByField } from '../../../../../../../api/zones';
import { getAllEquipements } from '../../../../../../../api/equipements';
import { getMembersByFarmer } from '../../../../../../../api/members';
import {
  closeHarvest,
  deleteHarvestById,
  getHarvestsByField,
} from '../../../../../../../api/harvests';
import { getFieldById } from '../../../../../../../api/field';

const SenegalFarmDashboard = () => {
  const params = useParams();
  const farmerId = String(params.farmerId);
  const fieldId = String(params.fieldId);
  const [farmer, setFarmer] = useState();
  const [fields, setFields] = useState(null);
  const [harvests, setHarvests] = useState([]);
  const [members, setMembers] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [weatherData, setWeatherData] = useState({});
  const [editingHarvest, setEditingHarvest] = useState(null);
  const [zones, setZones] = useState([]);
  const [zone, setZone] = useState();
  const [expandedCards, setExpandedCards] = useState({});
  const [selectedHarvest, setSelectedHarvest] = useState(null);
  const [harvestToClose, setHarvestToClose] = useState(null);
  const [harvestToDelete, setHarvestToDelete] = useState(null);
  const [meteo, setMeteo] = useState();
  const [dailyPrecipMm, setDailyPrecipMm] = useState([]);
  const [monthlyPrecipMm, setMonthlyPrecipMm] = useState(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const openCreateMember = () => {
    setSelectedMember(null);
    setShowMemberModal(true);
  };
  // Ouverture en édition
  const openEditMember = (m) => {
    setSelectedMember(m);
    setShowMemberModal(true);
  };

  // Callback unique pour créer/mettre à jour la liste
  const handleMemberSaved = useCallback((member) => {
    setMembers((prev) => {
      const ix = prev.findIndex((x) => x.id === member.id);
      if (ix === -1) return [member, ...prev];
      const next = prev.slice();
      next[ix] = { ...prev[ix], ...member };
      return next;
    });
  }, []);

  // Fonction pour ouvrir la modale de confirmation
  const sureToClick = (harvest) => {
    if (!harvest?.harvestQuality || harvest?.yieldTonnes === 0) {
      alert(
        'Impossible de clôturer cette récolte. Veuillez d’abord renseigner la qualité et le rendement dans les informations de récolte.'
      );
      return;
    } else {
      setHarvestToClose(harvest);
    }
  };

  const sureToClicktoDelete = (harvest) => {
    setHarvestToDelete(harvest);
  };

  // Fonction pour confirmer la clôture
  const confirmClosure = () => {
    if (harvestToClose) {
      sendClosure(harvestToClose.id);
      setHarvestToClose(null);
    }
  };

  const confirmDelete = () => {
    if (harvestToDelete) {
      handleDelete(harvestToDelete.id);
      setHarvestToDelete(null);
    }
  };

  useEffect(() => {
    if (!farmerId) return;

    const ac = new AbortController();

    const fetchData = async () => {
      try {
        const data = await getFarmerById(farmerId, { signal: ac.signal });
        if (ac.signal.aborted) return; // on ignore si abort
        setFarmer(data);
      } catch (err) {
        if (!ac.signal.aborted) {
          console.error('Erreur fetch farmer:', err);
        }
      }
    };

    fetchData();

    return () => ac.abort();
  }, [farmerId]);

  async function geocodeOpenMeteo(place, count = 1, lang = 'fr') {
    if (!place) return null;
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      place
    )}&count=${count}&language=${lang}&format=json`;
    const res = await fetch(url);
    const data = await res.json();

    console.log('📍 Résultats geocoding pour', place, ':', data);

    if (!data?.results?.length) return null;
    const { latitude, longitude, timezone } = data.results[0];
    return { lat: latitude, lon: longitude, timezone };
  }

  useEffect(() => {
    if (!farmerId) return;

    let cancelled = false;
    let inFlight = false; // évite les overlaps si une requête dure > 2 min
    let intervalId: ReturnType<typeof setInterval> | null = null;
    const ac = new AbortController(); // pour /farmer/:id

    const run = async () => {
      if (inFlight || cancelled) return;
      inFlight = true;
      try {
        // 1) Charger le farmer (via API centrale)
        const data = await getFarmerById(String(farmerId), {
          signal: ac.signal,
        });
        if (cancelled) return;
        setFarmer(data);
        console.log('Farmer reçu:', data);

        // 2) Construire la query
        const fullQuery = [
          data?.villageName,
          data?.communeName,
          data?.regionName,
          data?.countryName,
        ]
          .filter(Boolean)
          .join(', ')
          .trim();

        // 3) Géocodage avec fallbacks (on garde tes helpers existants)
        let geo = await geocodeOpenMeteo(fullQuery);
        if (!geo)
          geo = await geocodeOpenMeteo(
            [data?.regionName, 'Senegal'].filter(Boolean).join(', ')
          );
        if (!geo) geo = await geocodeOpenMeteo('Senegal');
        if (!geo || cancelled) return;

        const { lat, lon, timezone = 'Africa/Dakar' } = geo;

        // 4) Météo actuelle enrichie (open-meteo)
        const currentUrl =
          `https://api.open-meteo.com/v1/forecast` +
          `?latitude=${lat}&longitude=${lon}` +
          `&current=` +
          [
            'temperature_2m',
            'relative_humidity_2m',
            'is_day',
            'precipitation',
            'weather_code',
            'wind_speed_10m',
            'wind_gusts_10m',
            'wind_direction_10m',
            'pressure_msl',
            'surface_pressure',
            'cloud_cover',
          ].join(',') +
          `&timezone=${encodeURIComponent(timezone)}` +
          `&windspeed_unit=kmh&precipitation_unit=mm`;

        const curRes = await fetch(currentUrl);
        const curJson = await curRes.json();
        if (cancelled) return;

        const c = curJson?.current ?? null;
        const cw = curJson?.current_weather ?? null;
        const currentWeather = c
          ? {
              time: c.time,
              temperature: c.temperature_2m,
              humidity: c.relative_humidity_2m,
              windSpeed: c.wind_speed_10m,
              windGusts: c.wind_gusts_10m,
              windDirection: c.wind_direction_10m,
              pressure: c.pressure_msl ?? c.surface_pressure,
              precipitation: c.precipitation,
              cloudCover: c.cloud_cover,
              isDay: c.is_day ?? cw?.is_day,
              weatherCode: c.weather_code ?? cw?.weathercode,
            }
          : cw
          ? {
              time: cw.time,
              temperature: cw.temperature,
              windSpeed: cw.windspeed,
              windDirection: cw.winddirection,
              isDay: cw.is_day,
              weatherCode: cw.weathercode,
            }
          : null;

        setMeteo(currentWeather);

        // 5) Précipitations 30 derniers jours
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 29);
        const fmt = (d: Date) => d.toISOString().split('T')[0];

        const histUrl =
          `https://archive-api.open-meteo.com/v1/era5` +
          `?latitude=${lat}&longitude=${lon}` +
          `&start_date=${fmt(start)}&end_date=${fmt(end)}` +
          `&daily=precipitation_sum` +
          `&timezone=${encodeURIComponent(timezone)}`;

        const histRes = await fetch(histUrl);
        const hist = await histRes.json();
        if (!cancelled) {
          if (hist?.daily?.time && hist.daily.precipitation_sum) {
            const perDay = hist.daily.time.map((date: string, i: number) => ({
              date,
              precip: Number(hist.daily.precipitation_sum[i] ?? 0),
            }));
            const total = perDay.reduce((s: number, d: any) => s + d.precip, 0);
            setDailyPrecipMm(perDay);
            setMonthlyPrecipMm(total);
          } else {
            setDailyPrecipMm([]);
            setMonthlyPrecipMm(null);
          }
        }
      } catch (e) {
        if (!cancelled) console.error(e);
      } finally {
        if (!cancelled) setLastUpdate(new Date());
        inFlight = false;
      }
    };

    // premier chargement immédiat
    run();

    // refresh silencieux toutes les 2 minutes
    intervalId = setInterval(run, 120_000);

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
      ac.abort(); // annule la requête /farmer en cours si besoin
    };
  }, [farmerId]);

  useEffect(() => {
    if (!fieldId) return;
    const ac = new AbortController();

    (async () => {
      try {
        const data = await getFieldById(String(fieldId), { signal: ac.signal });
        if (ac.signal.aborted) return;
        console.log('Field reçu:', data);
        setFields(data);
      } catch (err) {
        if (!ac.signal.aborted) console.error('Erreur field:', err);
      }
    })();

    return () => ac.abort();
  }, [fieldId]);

  // 2) Harvests du field + zones liées à chaque harvest (one-by-one)
  useEffect(() => {
    if (!fieldId) return;
    const ac = new AbortController();

    (async () => {
      try {
        const list: any[] = await getHarvestsByField(String(fieldId), {
          signal: ac.signal,
        });
        if (ac.signal.aborted) return;

        console.log('Harvests reçus:', list);
        setHarvests(list);

        // récupérer les zones pour les harvests qui en ont une
        const zoneIds = Array.from(
          new Set(
            list
              .map((h) => h?.zone?.id)
              .filter(Boolean)
              .map(String)
          )
        );

        // fetch en parallèle
        const zones = await Promise.all(
          zoneIds.map((id) =>
            getZoneById(id, { signal: ac.signal }).catch(() => null)
          )
        );

        if (ac.signal.aborted) return;

        // garde ce que tu veux faire avec `setZone` (si c'est une zone unique) ou stocke une map
        // Exemple: si tu veux une liste:
        setZone(zones.filter(Boolean)); // ou bien setZonesMap(Object.fromEntries(...))
      } catch (err) {
        if (!ac.signal.aborted) console.error('Erreur harvests/zones:', err);
      }
    })();

    return () => ac.abort();
  }, [fieldId]);

  // 3) Members du farmer (dépend de farmerId, pas de fieldId)
  useEffect(() => {
    if (!farmerId) return;
    const ac = new AbortController();

    (async () => {
      try {
        const data = await getMembersByFarmer(String(farmerId), {
          signal: ac.signal,
        });
        if (ac.signal.aborted) return;
        console.log('Members reçus:', data);
        setMembers(data);
      } catch (err) {
        if (!ac.signal.aborted) console.error('Erreur members:', err);
      }
    })();

    return () => ac.abort();
  }, [farmerId]);

  // 5) Zones du field (liste complète) — si tu en as besoin en plus des zones des harvests
  useEffect(() => {
    if (!fieldId) return;
    const ac = new AbortController();

    (async () => {
      try {
        const data = await getZonesByField(String(fieldId), {
          signal: ac.signal,
        });
        if (ac.signal.aborted) return;
        console.log('Zones reçues:', data);
        setZones(data);
      } catch (err) {
        if (!ac.signal.aborted) console.error('Erreur zones:', err);
      }
    })();

    return () => ac.abort();
  }, [fieldId]);

  const getQualityColor = (quality) => {
    switch (quality) {
      case 'excellente':
        return 'text-green-600 bg-green-100';
      case 'bonne':
        return 'text-blue-600 bg-blue-100';
      case 'moyenne':
        return 'text-yellow-600 bg-yellow-100';
      case 'faible':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifiée';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 'N/A';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffDays / 30);
    const days = diffDays % 30;
    return `${months}m ${days}j`;
  };

  const toggleExpand = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const chartData =
    dailyPrecipMm?.map((day) => ({
      date: new Date(day.date).getDate(),
      fullDate: day.date,
      precip: day.precip,
      // Ajouter une couleur différente pour les jours avec beaucoup de pluie
      fill:
        day.precip > 50
          ? '#1E40AF'
          : day.precip > 20
          ? '#3B82F6'
          : day.precip > 0
          ? '#60A5FA'
          : '#E5E7EB',
    })) || [];

  // Calculer les statistiques
  const stats = {
    totalDays: dailyPrecipMm?.length || 0,
    rainyDays: dailyPrecipMm?.filter((d) => d.precip > 0).length || 0,
    averageDaily:
      monthlyPrecipMm && dailyPrecipMm?.length
        ? (monthlyPrecipMm / dailyPrecipMm.length).toFixed(1)
        : 0,
    maxDaily: Math.max(...(dailyPrecipMm?.map((d) => d.precip) || [0])).toFixed(
      1
    ),
  };

  // Formater le mois
  const getMonthYear = () => {
    if (!dailyPrecipMm?.length) return '';
    const firstDate = new Date(dailyPrecipMm[0].date);
    return firstDate.toLocaleDateString('fr-FR', {
      month: 'long',
      year: 'numeric',
    });
  };

  // Tooltip personnalisé
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg">
          <p className="text-sm font-medium">
            {new Date(data.fullDate).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
            })}
          </p>
          <p className="text-xs">{data.precip.toFixed(1)} mm</p>
        </div>
      );
    }
    return null;
  };

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

const getCropIcon = (cropType) => {
  if (!cropType) return '🌱';
  const key = cropType.toLowerCase().replace(/\s+/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return cropConfig[key]?.icon || '🌱';
};


  const safeText = (text: any): string => {
    const str = text == null ? '' : String(text);
    const normalized = (str as any).normalize ? str.normalize('NFKC') : str;
    const cleaned = normalized.replace(/\s+/g, ' ').trim();
    return cleaned || '—';
  };

  const isEnded = (v) => v === true || v === 'true';
  const ts = (d) => (d ? new Date(d).getTime() : 0); // 0 si pas de date
  const pickDate = (h) =>
    h.createdAt ?? h.harvestDate ?? h.plantingDate ?? h.closedAt ?? null;

  const statusFromHarvest = (h) => {
    if (!h?.harvestDate) return null;
    const d = new Date(h.harvestDate);
    const today = new Date();
    // on compare en jours (sans l'heure)
    const day = (x) =>
      new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
    const dd = day(d),
      tt = day(today);

    if (dd < tt) return 'Retard sur la récolte';
    if (dd === tt) return "Récolte prévue aujourd'hui";
    return 'Récolte à venir';
  };

  const calculateTotalWeight = () => {
    const total = harvests.reduce((sum, harvest) => {
      return sum + harvest.yieldTonnes;
    }, 0);
    return total;
  };

  const calculateTotalEnded = () => {
    const total = harvests.reduce((sum, harvest) => {
      return sum + harvest?.isEnd;
    }, 0);

    const totalHarvests = harvests.length;

    const toSend = `${total}/${totalHarvests}`;
    return toSend;
  };

  const calculateTotalRendement = (rows = harvests) => {
    const num = (v) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : 0; // évite NaN
    };

    // Surface utilisée par la récolte
    const surfaceOf = (h) => {
      const fieldSize = num(h?.field?.size); // ex: 25 ha
      const pctRaw = h?.zone?.percentage ?? h?.zonePercentageSnapshot; // ex: '60'
      const pct = num(pctRaw); // 60
      // Si on a un pourcentage, on prend la part; sinon toute la surface du champ
      return pct > 0 ? fieldSize * (pct / 100) : fieldSize;
    };

    // Somme des rendements (en tonnes)
    const totalYield = rows.reduce((sum, h) => sum + num(h?.yieldTonnes), 0);

    // Somme des surfaces (en ha)
    const totalSurface = rows.reduce((sum, h) => sum + surfaceOf(h), 0);

    if (totalSurface <= 0) return '—'; // évite division par 0 / NaN

    const avg = totalYield / totalSurface; // t/ha
    return avg.toFixed(3);
  };

  if (!fields) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-green-200 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-t-4 border-green-600 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-2 border-blue-200 animate-pulse animation-delay-200"></div>
            <div className="absolute inset-2 rounded-full border-t-2 border-blue-500 animate-spin animation-delay-400"></div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Chargement du Dashboard
          </h3>
          <p className="text-gray-600 mb-6">
            Synchronisation avec les capteurs IoT et données météorologiques...
          </p>
          <div className="w-80 bg-gray-200 rounded-full h-2 mx-auto overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-full rounded-full animate-pulse"
              style={{ width: '78%' }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  // Composants UI professionnels
  const MetricCard = ({
    title,
    value,
    unit,
    change,
    trend,
    icon: Icon,
    gradient,
    realtime = false,
  }) => (
    <div
      className={`relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 ${gradient} p-6 text-white group`}
    >
      <div className="absolute -top-8 -right-8 w-24 h-24 opacity-20 group-hover:opacity-30 transition-opacity">
        <Icon className="w-full h-full rotate-12" />
      </div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Icon className="w-6 h-6" />
          </div>
          {realtime && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm opacity-90 font-medium">Live</span>
            </div>
          )}
        </div>
        <div>
          <p className="text-sm opacity-90 mb-2 font-medium">{title}</p>
          <div className="flex items-baseline mb-3">
            <span className="text-3xl font-bold tracking-tight">{value}</span>
            <span className="text-lg ml-2 opacity-90">{unit}</span>
          </div>
          {change && (
            <div className="flex items-center">
              <TrendingUp
                className={`w-4 h-4 mr-1 ${
                  trend === 'down' ? 'rotate-180' : ''
                }`}
              />
              <span className="text-sm font-semibold">{change}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const ChartContainer = ({ title, subtitle, children, actions = [] }) => (
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      <div className="px-8 py-6 bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b border-gray-100/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {actions.map((action, index) => (
              <button
                key={index}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <action.icon className="w-5 h-5 text-gray-500" />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="p-8">{children}</div>
    </div>
  );

  const StatBox = ({
    icon: Icon,
    label,
    value,
    unit,
    color = 'blue',
    size = 'sm',
  }) => (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-200 ${
        size === 'lg' ? 'p-6' : ''
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className={`p-2 bg-${color}-100 rounded-lg`}>
          <Icon className={`w-5 h-5 text-${color}-600`} />
        </div>
        <div>
          <p
            className={`text-sm font-medium text-gray-600 ${
              size === 'lg' ? 'text-base' : ''
            }`}
          >
            {label}
          </p>
          <div className="flex items-baseline">
            <span
              className={`font-bold text-gray-900 ${
                size === 'lg' ? 'text-2xl' : 'text-lg'
              }`}
            >
              {value}
            </span>
            <span
              className={`ml-1 text-gray-500 ${
                size === 'lg' ? 'text-sm' : 'text-xs'
              }`}
            >
              {unit}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const handleEdit = (harvestId) => {
    const harvestToEdit = harvests.find((h) => h.id === harvestId);
    setEditingHarvest(harvestToEdit);
  };

  // Fonction appelée quand la modification est terminée
  const handleEditComplete = (harvestId, updatedData) => {
    if (harvestId && updatedData) {
      // Mettre à jour la récolte dans votre état
      setHarvests((prev) =>
        prev.map((h) => (h.id === harvestId ? { ...h, ...updatedData } : h))
      );
    }
    // Réinitialiser l'état d'édition
    setEditingHarvest(null);
  };

  const sendClosure = async (harvestId: string) => {
    try {
      const data = await closeHarvest(String(fieldId), String(harvestId));
      setHarvests((prev) => prev.filter((f) => f.id !== harvestId));
      console.log('Clôture harvest OK :', data);
    } catch (err) {
      console.error('Erreur clôture harvest :', err);
    }
  };

  const handleDelete = async (harvestId: string) => {
    try {
      await deleteHarvestById(String(harvestId));
      setHarvests((prev) => prev.filter((f) => f.id !== harvestId));
      console.log('Harvest supprimé');
    } catch (err) {
      console.error('Erreur suppression harvest :', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      {/* Header Premium */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 via-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Leaf className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  {fields.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 mt-2">
                  <span className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-red-500" />
                    {[
                      farmer?.villageName,
                      farmer?.communeName,
                      farmer?.regionName,
                      farmer?.countryName,
                    ]
                      .filter(Boolean) // enlève les champs vides/null
                      .map(
                        (part) =>
                          part.charAt(0).toUpperCase() +
                          part.slice(1).toLowerCase()
                      ) // TitleCase
                      .join(' • ')}
                  </span>

                  <span className="flex items-center text-sm text-emerald-600 font-medium">
                    <Satellite className="w-4 h-4 mr-1" />
                    IoT Connecté
                  </span>
                  <span className="text-sm text-gray-500">
                    MAJ:{' '}
                    {lastUpdate ? lastUpdate.toLocaleTimeString('fr-FR') : '—'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-xl">
                <Users className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {fields.membres} membres
                </span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-green-100 rounded-xl">
                <Award className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  {fields.certification}
                </span>
              </div>
              <button className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Météo Temps Réel */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Cloud className="w-6 h-6 mr-3 text-blue-600" />
              Conditions Météorologiques Actuelles
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="mr-6">Données en temps réel</span>
              <ActionsDropdown
                farmerId={farmerId}
                fieldId={fieldId}
                editingHarvest={editingHarvest}
                onEditComplete={handleEditComplete}
                onSubmit={(harvest) => {
                  // EXISTANT (récoltes)
                  setHarvests((prev) => {
                    const ix = prev.findIndex((h) => h.id === harvest.id);
                    if (ix === -1) return [harvest, ...prev];
                    const next = prev.slice();
                    next[ix] = { ...prev[ix], ...harvest };
                    return next;
                  });
                }}
                onMemberSaved={handleMemberSaved}
                onAddMember={openCreateMember}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <StatBox
              icon={Thermometer}
              label="Température"
              value={meteo?.temperature}
              unit="°C"
              color="orange"
            />
            <StatBox
              icon={Droplets}
              label="Humidité"
              value={meteo?.humidity}
              unit="%"
              color="blue"
            />
            <StatBox
              icon={Wind}
              label="Vitesse Vent"
              value={meteo?.windSpeed}
              unit="km/h"
              color="gray"
            />
            <StatBox
              icon={CloudRain}
              label="Précipitations"
              value={meteo?.precipitation}
              unit="mm"
              color="cyan"
            />
            <StatBox
              icon={Gauge}
              label="Pression"
              value={meteo?.pressure}
              unit="hPa"
              color="purple"
            />
          </div>
        </div>

        {/* KPIs Principaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <MetricCard
            title="Production Totale"
            value={calculateTotalWeight()}
            unit="Tonnes"
            change="+x%"
            trend="up"
            icon={Sprout}
            gradient="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600"
          />
          <MetricCard
            title="Récoltes terminées"
            value={calculateTotalEnded()}
            unit="récoltes"
            change="+x%"
            trend="up"
            icon={TimerOff}
            gradient="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600"
          />
          <MetricCard
            title="Précipitations"
            value={monthlyPrecipMm?.toFixed(1) || 0}
            unit="mm"
            change="+x%"
            trend="up"
            icon={Droplets}
            gradient="bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600"
            realtime={true}
          />
          <MetricCard
            title="Rendement Moyen"
            value={calculateTotalRendement()}
            unit="Tonnes/ha"
            change="+x%"
            trend="up"
            icon={TrendingUp}
            gradient="bg-gradient-to-br from-orange-500 via-red-500 to-pink-600"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="border-b border-gray-100">
            <nav className="flex overflow-x-auto">
              {[
                { id: 'overview', label: "Vue d'ensemble", icon: BarChart3 },
                { id: 'harvests', label: 'Cultures', icon: Sprout },
                { id: 'calendar', label: 'Calendriier', icon: Calendar },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-emerald-600 bg-emerald-50 border-b-3 border-emerald-500'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="mt-3">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <CloudRain className="w-5 h-5 text-blue-600" />
                    Précipitations - {getMonthYear()}
                  </h3>

                  {/* Résumé des statistiques */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Droplets className="w-5 h-5 text-blue-600" />
                        <div className="text-xs text-blue-600 font-medium bg-blue-200 px-2 py-0.5 rounded-full">
                          Total
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">
                        {monthlyPrecipMm?.toFixed(1) || 0}
                      </p>
                      <p className="text-sm text-gray-600">mm ce mois</p>
                      <div className="mt-2 w-full bg-blue-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full transition-all duration-1000"
                          style={{
                            width: `${Math.min(
                              (monthlyPrecipMm / 200) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Calendar className="w-5 h-5 text-green-600" />
                        <div className="text-xs text-green-600 font-medium bg-green-200 px-2 py-0.5 rounded-full">
                          Fréquence
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">
                        {stats.rainyDays}
                      </p>
                      <p className="text-sm text-gray-600">jours de pluie</p>
                      <p className="text-xs text-green-600 mt-1">
                        {((stats.rainyDays / stats.totalDays) * 100).toFixed(0)}
                        % du mois
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                        <div className="text-xs text-purple-600 font-medium bg-purple-200 px-2 py-0.5 rounded-full">
                          Moyenne
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">
                        {stats.averageDaily}
                      </p>
                      <p className="text-sm text-gray-600">mm/jour</p>
                      <p className="text-xs text-purple-600 mt-1">
                        Sur {stats.totalDays} jours
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <CloudRain className="w-5 h-5 text-orange-600" />
                        <div className="text-xs text-orange-600 font-medium bg-orange-200 px-2 py-0.5 rounded-full">
                          Record
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">
                        {stats.maxDaily}
                      </p>
                      <p className="text-sm text-gray-600">mm max</p>
                      <p className="text-xs text-orange-600 mt-1">
                        En une journée
                      </p>
                    </div>
                  </div>

                  {/* Graphique Recharts */}
                  {dailyPrecipMm && dailyPrecipMm.length > 0 ? (
                    <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 shadow-lg">
                      <div className="mb-4 flex items-center justify-between">
                        <h4 className="font-medium text-gray-700">
                          Distribution quotidienne des précipitations
                        </h4>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-600 rounded"></div>
                            <span className="text-gray-600">&gt; 50mm</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-400 rounded"></div>
                            <span className="text-gray-600">20-50mm</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-300 rounded"></div>
                            <span className="text-gray-600">1-20mm</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-gray-200 rounded"></div>
                            <span className="text-gray-600">0mm</span>
                          </div>
                        </div>
                      </div>

                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart
                          data={chartData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#E5E7EB"
                          />
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12, fill: '#6B7280' }}
                            axisLine={{ stroke: '#E5E7EB' }}
                          />
                          <YAxis
                            tick={{ fontSize: 12, fill: '#6B7280' }}
                            axisLine={{ stroke: '#E5E7EB' }}
                            label={{
                              value: 'Précipitations (mm)',
                              angle: -90,
                              position: 'insideLeft',
                              style: { fontSize: 12, fill: '#6B7280' },
                            }}
                          />
                          <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                          />
                          <Bar
                            dataKey="precip"
                            radius={[4, 4, 0, 0]}
                            animationDuration={1000}
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>

                      {/* Analyse des tendances */}
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          {/* Période la plus pluvieuse */}
                          <div className="bg-blue-50 rounded-lg p-3">
                            <p className="text-gray-600 mb-1">
                              Période la plus humide
                            </p>
                            <p className="font-semibold text-blue-900">
                              {(() => {
                                const weeks = [];
                                for (
                                  let i = 0;
                                  i < dailyPrecipMm.length;
                                  i += 7
                                ) {
                                  const weekData = dailyPrecipMm.slice(
                                    i,
                                    i + 7
                                  );
                                  const weekTotal = weekData.reduce(
                                    (sum, d) => sum + d.precip,
                                    0
                                  );
                                  weeks.push({ start: i, total: weekTotal });
                                }
                                const maxWeek = weeks.reduce((max, week) =>
                                  week.total > max.total ? week : max
                                );
                                return `Semaine ${
                                  Math.floor(maxWeek.start / 7) + 1
                                }`;
                              })()}
                            </p>
                          </div>

                          {/* Tendance */}
                          <div className="bg-green-50 rounded-lg p-3">
                            <p className="text-gray-600 mb-1">
                              Tendance mensuelle
                            </p>
                            <p className="font-semibold text-green-900">
                              {monthlyPrecipMm > 100
                                ? 'Au-dessus'
                                : monthlyPrecipMm < 50
                                ? 'En-dessous'
                                : 'Dans'}{' '}
                              de la normale
                            </p>
                          </div>

                          {/* Prévision */}
                          <div className="bg-purple-50 rounded-lg p-3">
                            <p className="text-gray-600 mb-1">
                              Impact sur les cultures
                            </p>
                            <p className="font-semibold text-purple-900">
                              {monthlyPrecipMm > 150
                                ? "Risque d'excès"
                                : monthlyPrecipMm < 30
                                ? 'Irrigation nécessaire'
                                : 'Conditions favorables'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-8 text-center">
                      <CloudRain className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">
                        Aucune donnée de précipitation disponible
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Les données historiques seront affichées ici
                      </p>
                    </div>
                  )}

                  {/* Recommandations contextuelles */}
                  {monthlyPrecipMm !== null &&
                    monthlyPrecipMm !== undefined && (
                      <div
                        className={`mt-4 p-4 rounded-xl ${
                          monthlyPrecipMm > 150
                            ? 'bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200'
                            : monthlyPrecipMm < 30
                            ? 'bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200'
                            : 'bg-gradient-to-r from-green-50 to-green-100 border border-green-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              monthlyPrecipMm > 150
                                ? 'bg-blue-200'
                                : monthlyPrecipMm < 30
                                ? 'bg-orange-200'
                                : 'bg-green-200'
                            }`}
                          >
                            <AlertCircle
                              className={`w-5 h-5 ${
                                monthlyPrecipMm > 150
                                  ? 'text-blue-700'
                                  : monthlyPrecipMm < 30
                                  ? 'text-orange-700'
                                  : 'text-green-700'
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <p
                              className={`font-semibold mb-2 ${
                                monthlyPrecipMm > 150
                                  ? 'text-blue-900'
                                  : monthlyPrecipMm < 30
                                  ? 'text-orange-900'
                                  : 'text-green-900'
                              }`}
                            >
                              {monthlyPrecipMm > 150
                                ? '⚠️ Précipitations excessives détectées'
                                : monthlyPrecipMm < 30
                                ? '⚠️ Déficit hydrique important'
                                : '✅ Pluviométrie optimale pour les cultures'}
                            </p>
                            <ul
                              className={`text-sm space-y-1 ${
                                monthlyPrecipMm > 150
                                  ? 'text-blue-800'
                                  : monthlyPrecipMm < 30
                                  ? 'text-orange-800'
                                  : 'text-green-800'
                              }`}
                            >
                              {monthlyPrecipMm > 150 ? (
                                <>
                                  <li>
                                    • Vérifiez le drainage de vos parcelles
                                  </li>
                                  <li>
                                    • Surveillez l'apparition de maladies
                                    fongiques
                                  </li>
                                  <li>
                                    • Reportez les semis si le sol est saturé
                                  </li>
                                </>
                              ) : monthlyPrecipMm < 30 ? (
                                <>
                                  <li>
                                    • Activez l'irrigation d'appoint si
                                    disponible
                                  </li>
                                  <li>
                                    • Privilégiez les cultures résistantes à la
                                    sécheresse
                                  </li>
                                  <li>
                                    • Appliquez du paillage pour conserver
                                    l'humidité
                                  </li>
                                </>
                              ) : (
                                <>
                                  <li>
                                    • Conditions idéales pour la croissance
                                  </li>
                                  <li>
                                    • Maintenez le calendrier de culture prévu
                                  </li>
                                  <li>
                                    • Surveillez régulièrement l'état des plants
                                  </li>
                                </>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            )}
            {activeTab === 'harvests' && (
              <ChartContainer
                title="Mes Cultures"
                subtitle="Suivi détaillé de vos récoltes et performances agricoles"
                actions={[{ icon: Cloud }, { icon: Download }]}
              >
                <div className="max-w-7xl mx-auto">
                  {/* Grille de cartes */}
                  <div className="grid gap-6">
                    {harvests
                      .slice()
                      .sort((a, b) => {
                        // 1) en cours (false) avant finis (true)
                        if (isEnded(a.isEnd) !== isEnded(b.isEnd)) {
                          return isEnded(a.isEnd) ? 1 : -1;
                        }
                        // 2) plus récent -> plus vieux
                        return ts(pickDate(a)) - ts(pickDate(b));
                      })
                      .map((harvest) => {
                        const fieldSize = Number(harvest?.field?.size ?? 0);
                        const totalYield = Number(harvest?.yieldTonnes ?? 0);
                        const yieldPerHa =
                          fieldSize > 0 ? totalYield / fieldSize : null;

                        const isExpanded = !!expandedCards[harvest.id];
                        const zonePct =
                          harvest?.zone?.percentage ??
                          harvest?.zonePercentageSnapshot ??
                          null;

                        const status = statusFromHarvest(harvest);

                        // retourne du JSX (ou null si tu ne veux rien afficher)
                        return (
                          <div
                            key={harvest.id}
                            className={`
                            relative bg-white rounded-xl shadow-lg overflow-hidden
                            hover:shadow-xl transition-all duration-300
                          `}
                          >
                            {/* En-tête de la carte avec gradient */}
                            <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 p-6 text-white">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="text-4xl">
                                    {getCropIcon(harvest.cropType)}
                                  </div>
                                  <div>
                                    <h2 className="text-2xl font-bold flex items-center gap-2">
                                      {safeText(harvest.cropType)}
                                      <span className="text-sm font-normal bg-white/20 px-2 py-1 rounded-full">
                                        {safeText(harvest.variety)}
                                      </span>
                                    </h2>
                                    <div className="flex items-center gap-4 mt-2 text-green-100">
                                      <span className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {safeText(harvest?.field?.name)}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Scale className="w-4 h-4" />
                                        {safeText(zonePct, '—')}% de la zone
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Menu d'actions */}
                                <div className="flex items-center gap-2">
                                  <TooltipProvider>
                                    <UITooltip>
                                      <TooltipTrigger asChild>
                                        <button
                                          type="button"
                                          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                          aria-label="Clôturer la récolte"
                                          onClick={() => sureToClick(harvest)}
                                        >
                                          <CalendarCheck className="w-5 h-5" />
                                        </button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Clôturer la récolte</p>
                                      </TooltipContent>
                                    </UITooltip>

                                    <UITooltip>
                                      <TooltipTrigger asChild>
                                        <button
                                          type="button"
                                          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                          onClick={() => handleEdit(harvest.id)}
                                          aria-label="Modifier la récolte"
                                        >
                                          <Edit className="w-5 h-5" />
                                        </button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Modifier la récolte</p>
                                      </TooltipContent>
                                    </UITooltip>

                                    <UITooltip>
                                      <TooltipTrigger asChild>
                                        <button
                                          type="button"
                                          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                          onClick={() => {
                                            sureToClicktoDelete(harvest);
                                          }}
                                          aria-label="Supprimer la récolte"
                                        >
                                          <Trash2 className="w-5 h-5" />
                                        </button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Supprimer la récolte</p>
                                      </TooltipContent>
                                    </UITooltip>
                                  </TooltipProvider>
                                </div>
                              </div>
                            </div>

                            {/* Corps de la carte */}
                            <div className="p-6">
                              {/* Métriques principales */}
                              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                                <div className="bg-blue-50 rounded-lg p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <Wheat className="w-5 h-5 text-blue-600" />
                                    <span className="text-xs text-blue-600 font-medium">
                                      Rendement
                                    </span>
                                  </div>
                                  <p className="text-2xl font-bold text-blue-900">
                                    {yieldPerHa !== 0
                                      ? `${yieldPerHa?.toFixed(2)} T/ha`
                                      : '—'}
                                  </p>
                                  <p className="text-xs text-blue-700 mt-1">
                                    {' '}
                                    Total:
                                    {yieldPerHa !== 0
                                      ? `${safeText(totalYield)} T`
                                      : ' —'}
                                  </p>
                                </div>

                                <div className="bg-green-50 rounded-lg p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <MapPin className="w-5 h-5 text-green-600" />
                                    <span className="text-xs text-green-600 font-medium">
                                      Surface
                                    </span>
                                  </div>
                                  <p className="text-2xl font-bold text-green-900">
                                    {safeText(harvest?.field?.size, '—')} ha
                                  </p>
                                  <p className="text-xs text-green-700 mt-1">
                                    {/* ❌ ne JAMAIS faire harvest.zone.name en direct */}
                                    {safeText(
                                      harvest?.zone?.name ??
                                        harvest?.zoneNameSnapshot,
                                      'Zone supprimée'
                                    )}
                                  </p>
                                </div>

                                <div className="bg-purple-50 rounded-lg p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <Calendar className="w-5 h-5 text-purple-600" />
                                    <span className="text-xs text-purple-600 font-medium">
                                      Durée
                                    </span>
                                  </div>
                                  <p className="text-2xl font-bold text-purple-900">
                                    {calculateDuration(
                                      harvest.plantingDate,
                                      harvest.harvestDate
                                    )}
                                  </p>
                                  <p className="text-xs text-purple-700 mt-1">
                                    Cycle complet
                                  </p>
                                </div>

                                <div className="bg-orange-50 rounded-lg p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <Droplets className="w-5 h-5 text-orange-600" />
                                    <span className="text-xs text-orange-600 font-medium">
                                      Irrigation
                                    </span>
                                  </div>
                                  <p className="text-lg font-bold text-orange-900 capitalize">
                                    {harvest.field.irrigationSystem}
                                  </p>
                                  <p className="text-xs text-orange-700 mt-1">
                                    Système actif
                                  </p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <Info className="w-5 h-5 text-gray-600" />
                                    <span className="text-xs text-gray-600 font-medium">
                                      Qualité
                                    </span>
                                  </div>
                                  <span
                                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize border ${getQualityColor(
                                      harvest.harvestQuality
                                    )}`}
                                  >
                                    {harvest.harvestQuality !== ''
                                      ? `${harvest.harvestQuality}`
                                      : ' —'}
                                  </span>
                                  <p className="text-xs text-gray-700 mt-1">
                                    Sol: {harvest.field.soilType}
                                  </p>
                                </div>
                              </div>

                              {/* Dates importantes */}
                              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <div className="flex items-center justify-between">
                                  {/* Timeline section */}
                                  <div className="flex items-center gap-8">
                                    {/* Date de plantation */}
                                    <div className="text-center">
                                      <div className="flex flex-col items-center gap-2">
                                        <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
                                        <div>
                                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                            Plantation
                                          </p>
                                          <p className="font-bold text-gray-900 text-sm">
                                            {safeText(
                                              formatDate(harvest.plantingDate)
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Timeline connector */}
                                    <div className="flex items-center">
                                      <div className="w-12 h-0.5 bg-gradient-to-r from-green-500 to-amber-500 rounded-full"></div>
                                      <div className="mx-2">
                                        <svg
                                          className="w-5 h-5 text-gray-400"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      </div>
                                      <div className="w-12 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"></div>
                                    </div>

                                    {/* Date de récolte */}
                                    <div className="text-center">
                                      <div className="flex flex-col items-center gap-2">
                                        <div
                                          className={`w-4 h-4 rounded-full shadow-sm ${
                                            status === 'Retard sur la récolte'
                                              ? 'bg-red-500 animate-pulse'
                                              : status ===
                                                "Récolte prévue aujourd'hui"
                                              ? 'bg-orange-500 animate-pulse'
                                              : 'bg-yellow-500'
                                          }`}
                                        ></div>
                                        <div>
                                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                            Récolte
                                          </p>
                                          <p className="font-bold text-gray-900 text-sm">
                                            {safeText(
                                              formatDate(harvest.harvestDate)
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Badge de statut */}
                                    {status && (
                                      <div className="ml-4">
                                        <span
                                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${
                                            status === 'Retard sur la récolte'
                                              ? 'bg-red-100 text-red-800 border border-red-200'
                                              : status ===
                                                "Récolte prévue aujourd'hui"
                                              ? 'bg-orange-100 text-orange-800 border border-orange-200'
                                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                          }`}
                                        >
                                          <div
                                            className={`w-2 h-2 rounded-full mr-2 ${
                                              status === 'Retard sur la récolte'
                                                ? 'bg-red-500'
                                                : status ===
                                                  "Récolte prévue aujourd'hui"
                                                ? 'bg-orange-500'
                                                : 'bg-emerald-500'
                                            }`}
                                          ></div>
                                          {status}
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Bouton d'expansion */}
                                  <button
                                    onClick={() => toggleExpand(harvest.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                                      isExpanded
                                        ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300'
                                    }`}
                                  >
                                    <span className="text-sm font-medium">
                                      {isExpanded ? 'Réduire' : 'Détails'}
                                    </span>
                                    <div
                                      className={`transform transition-transform duration-200 ${
                                        isExpanded ? 'rotate-180' : 'rotate-0'
                                      }`}
                                    >
                                      <svg
                                        className="w-4 h-4"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </div>
                                  </button>
                                </div>

                                {/* Ligne de progression visuelle */}
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                  <div className="relative">
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                      <div
                                        className={`h-full transition-all duration-1000 ease-out ${
                                          status === 'Retard sur la récolte'
                                            ? 'bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 w-full'
                                            : status ===
                                              "Récolte prévue aujourd'hui"
                                            ? 'bg-gradient-to-r from-green-500 to-orange-500 w-full'
                                            : 'bg-gradient-to-r from-green-500 to-yellow-500 w-3/4'
                                        }`}
                                      ></div>
                                    </div>

                                    {/* Labels de progression */}
                                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                                      <span>Plantée</span>
                                      <span
                                        className={`font-medium ${
                                          status === 'Retard sur la récolte'
                                            ? 'text-red-600'
                                            : status ===
                                              "Récolte prévue aujourd'hui"
                                            ? 'text-orange-600'
                                            : 'text-emerald-600'
                                        }`}
                                      >
                                        {status === 'Retard sur la récolte'
                                          ? 'En retard'
                                          : status ===
                                            "Récolte prévue aujourd'hui"
                                          ? "Aujourd'hui"
                                          : 'En croissance'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Section extensible */}
                              {isExpanded && (
                                <div className="mt-4 space-y-4 border-t pt-4">
                                  {harvest.pesticidesUsed && (
                                    <div className="bg-blue-50 rounded-lg p-4">
                                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                        <Leaf className="w-4 h-4 text-blue-600" />
                                        Intrants utilisés
                                      </h4>
                                      <p className="text-gray-700">
                                        {harvest.pesticidesUsed}
                                      </p>
                                    </div>
                                  )}

                                  {harvest.problemsEncountered && (
                                    <div className="bg-orange-50 rounded-lg p-4">
                                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                                        Problèmes rencontrés
                                      </h4>
                                      <p className="text-gray-700">
                                        {harvest.problemsEncountered}
                                      </p>
                                    </div>
                                  )}

                                  {harvest.notes && (
                                    <div className="bg-gray-50 rounded-lg p-4">
                                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                        <Info className="w-4 h-4 text-gray-600" />
                                        Notes et observations
                                      </h4>
                                      <p className="text-gray-700">
                                        {harvest.notes}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            {harvest.isEnd && (
                              <div className="absolute rounded-xl inset-0 bg-gray-200/60 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                                <span className="px-3 py-1 mb-3 text-sm font-semibold text-gray-700 bg-white rounded-lg shadow">
                                  Récolte clôturée
                                </span>
                                <button
                                  onClick={() => setSelectedHarvest(harvest)}
                                  className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-lg hover:bg-gray-800 transition"
                                >
                                  Voir détails
                                </button>
                              </div>
                            )}

                            {/* Modal détails (lecture seule) – garde safeText/snapshots */}
                            {/* Modal détails complet de la récolte */}
                            {selectedHarvest && (
                              <div className="fixed inset-0 bg-opacity-100 backdrop-blur-md backdrop-blur-sm flex items-center justify-center p-4 z-50">
                                <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                                  {/* Header */}
                                  <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center rounded-t-lg">
                                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                                      🌾 Détails de la récolte
                                    </h2>
                                    <button
                                      onClick={() => setSelectedHarvest(null)}
                                      className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-colors"
                                    >
                                      <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M6 18L18 6M6 6l12 12"
                                        />
                                      </svg>
                                    </button>
                                  </div>

                                  <div className="p-6 space-y-8">
                                    {/* Section Culture */}
                                    <div className="bg-green-50 rounded-lg p-6">
                                      <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                                        🌱 Informations de Culture
                                      </h3>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex flex-col">
                                          <span className="text-sm font-medium text-gray-600">
                                            Type de culture
                                          </span>
                                          <span className="text-gray-900 bg-white p-2 rounded border">
                                            {safeText(selectedHarvest.cropType)}
                                          </span>
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="text-sm font-medium text-gray-600">
                                            Variété
                                          </span>
                                          <span className="text-gray-900 bg-white p-2 rounded border">
                                            {safeText(selectedHarvest.variety)}
                                          </span>
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="text-sm font-medium text-gray-600">
                                            Date de plantation
                                          </span>
                                          <span className="text-gray-900 bg-white p-2 rounded border">
                                            {safeText(
                                              selectedHarvest.plantingDate
                                            )}
                                          </span>
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="text-sm font-medium text-gray-600">
                                            Date de récolte
                                          </span>
                                          <span className="text-gray-900 bg-white p-2 rounded border">
                                            {safeText(
                                              selectedHarvest.harvestDate
                                            )}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Section Terrain */}
                                    <div className="bg-amber-50 rounded-lg p-6">
                                      <h3 className="text-lg font-semibold text-amber-800 mb-4 flex items-center">
                                        🏞️ Informations du Terrain
                                      </h3>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex flex-col">
                                          <span className="text-sm font-medium text-gray-600">
                                            Taille du terrain
                                          </span>
                                          <span className="text-gray-900 bg-white p-2 rounded border">
                                            {safeText(
                                              selectedHarvest?.field?.size
                                            )}
                                            {selectedHarvest?.field?.size &&
                                              ' ha'}
                                          </span>
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="text-sm font-medium text-gray-600">
                                            Type de sol
                                          </span>
                                          <span className="text-gray-900 bg-white p-2 rounded border">
                                            {safeText(
                                              selectedHarvest?.field?.soilType
                                            )}
                                          </span>
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="text-sm font-medium text-gray-600">
                                            Système d'irrigation
                                          </span>
                                          <span className="text-gray-900 bg-white p-2 rounded border">
                                            {safeText(
                                              selectedHarvest?.field
                                                ?.irrigationSystem
                                            )}
                                          </span>
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="text-sm font-medium text-gray-600">
                                            Zone
                                          </span>
                                          <span className="text-gray-900 bg-white p-2 rounded border">
                                            {safeText(
                                              selectedHarvest?.zone?.name ??
                                                selectedHarvest?.zoneNameSnapshot,
                                              'Zone supprimée'
                                            )}
                                            {safeText(
                                              selectedHarvest?.zone
                                                ?.percentage ??
                                                selectedHarvest?.zonePercentageSnapshot ??
                                                '',
                                              ''
                                            ) &&
                                              ` (${safeText(
                                                selectedHarvest?.zone
                                                  ?.percentage ??
                                                  selectedHarvest?.zonePercentageSnapshot
                                              )}%)`}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Section Production */}
                                    <div className="bg-blue-50 rounded-lg p-6">
                                      <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                                        📊 Production et Qualité
                                      </h3>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex flex-col">
                                          <span className="text-sm font-medium text-gray-600">
                                            Rendement
                                          </span>
                                          <span className="text-gray-900 bg-white p-2 rounded border font-semibold">
                                            {safeText(
                                              selectedHarvest?.yieldTonnes
                                            )}
                                            {selectedHarvest?.yieldTonnes &&
                                              ' tonnes'}
                                          </span>
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="text-sm font-medium text-gray-600">
                                            Qualité de la récolte
                                          </span>
                                          <span className="text-gray-900 bg-white p-2 rounded border">
                                            {safeText(
                                              selectedHarvest?.harvestQuality
                                            )}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Section Traitements et Problèmes */}
                                    <div className="bg-red-50 rounded-lg p-6">
                                      <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                                        ⚠️ Traitements et Problèmes Rencontrés
                                      </h3>
                                      <div className="space-y-4">
                                        <div className="flex flex-col">
                                          <span className="text-sm font-medium text-gray-600">
                                            Pesticides utilisés
                                          </span>
                                          <span className="text-gray-900 bg-white p-3 rounded border min-h-[60px]">
                                            {safeText(
                                              selectedHarvest?.pesticidesUsed,
                                              'Aucun pesticide utilisé'
                                            )}
                                          </span>
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="text-sm font-medium text-gray-600">
                                            Problèmes rencontrés
                                          </span>
                                          <span className="text-gray-900 bg-white p-3 rounded border min-h-[60px]">
                                            {safeText(
                                              selectedHarvest?.problemsEncountered,
                                              'Aucun problème signalé'
                                            )}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Section Notes */}
                                    {selectedHarvest?.notes && (
                                      <div className="bg-purple-50 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                                          📝 Notes additionnelles
                                        </h3>
                                        <div className="text-gray-900 bg-white p-3 rounded border whitespace-pre-wrap">
                                          {safeText(selectedHarvest.notes)}
                                        </div>
                                      </div>
                                    )}

                                    {/* Footer Actions */}
                                    <div className="flex justify-end space-x-3 pt-4 border-t">
                                      <button
                                        onClick={() => setSelectedHarvest(null)}
                                        className="px-6 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                      >
                                        Fermer
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {harvestToClose && (
                              <div className="fixed inset-0 bg-opacity-100 backdrop-blur-md backdrop-blur-sm flex items-center justify-center p-4 z-50">
                                <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
                                  {/* Header */}
                                  <div className="p-8 pb-6 text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
                                      <svg
                                        className="w-30 h-30 text-red-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M12 9v2m0 4h.01"
                                        />
                                      </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                      Clôturer la récolte
                                    </h3>
                                    <p className="text-gray-500">
                                      Cette action est irréversible
                                    </p>
                                  </div>

                                  {/* Contenu */}
                                  <div className="px-8 pb-6">
                                    {/* Informations sur la récolte */}
                                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                      <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Culture
                                          </span>
                                          <span className="font-medium text-gray-900">
                                            {harvestToClose.cropType} -{' '}
                                            {harvestToClose.variety}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Zone
                                          </span>
                                          <span className="font-medium text-gray-900">
                                            {harvestToClose?.zone?.name ??
                                              harvestToClose?.zoneNameSnapshot ??
                                              'Zone supprimée'}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Date
                                          </span>
                                          <span className="font-medium text-gray-900">
                                            {harvestToClose.harvestDate}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Message d'avertissement */}
                                    <div className="text-center text-gray-600 text-sm leading-relaxed">
                                      Une fois clôturée, cette récolte ne pourra
                                      plus être modifiée.
                                      <br />
                                      Elle restera consultable dans
                                      l'historique.
                                    </div>
                                  </div>

                                  {/* Actions */}
                                  <div className="p-8 pt-6 flex gap-3">
                                    <button
                                      onClick={() => setHarvestToClose(null)}
                                      className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium"
                                    >
                                      Annuler
                                    </button>
                                    <button
                                      onClick={confirmClosure}
                                      className="flex-1 px-6 py-3 text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors font-medium"
                                    >
                                      Clôturer
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                            {harvestToDelete && (
                              <div className="fixed inset-0 bg-opacity-100 backdrop-blur-md backdrop-blur-sm flex items-center justify-center p-4 z-50">
                                <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
                                  {/* Header */}
                                  <div className="p-8 pb-6 text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
                                      <svg
                                        className="w-30 h-30 text-red-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M12 9v2m0 4h.01"
                                        />
                                      </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                      Supprimer la récolte
                                    </h3>
                                    <p className="text-gray-500">
                                      Cette action est irréversible
                                    </p>
                                  </div>

                                  {/* Contenu */}
                                  <div className="px-8 pb-6">
                                    {/* Informations sur la récolte */}
                                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                      <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Culture
                                          </span>
                                          <span className="font-medium text-gray-900">
                                            {harvestToDelete.cropType} -{' '}
                                            {harvestToDelete.variety}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Zone
                                          </span>
                                          <span className="font-medium text-gray-900">
                                            {harvestToDelete?.zone?.name ??
                                              harvestToDelete?.zoneNameSnapshot ??
                                              'Zone supprimée'}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Date
                                          </span>
                                          <span className="font-medium text-gray-900">
                                            {harvestToDelete.harvestDate}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Message d'avertissement */}
                                    <div className="text-center text-gray-600 text-sm leading-relaxed">
                                      Une fois supprimé, cette récolte ne pourra
                                      plus être modifiée.
                                      <br />
                                      Elle ne restera pas consultable dans
                                      l'historique.
                                    </div>
                                  </div>

                                  {/* Actions */}
                                  <div className="p-8 pt-6 flex gap-3">
                                    <button
                                      onClick={() => setHarvestToDelete(null)}
                                      className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium"
                                    >
                                      Annuler
                                    </button>
                                    <button
                                      onClick={confirmDelete}
                                      className="flex-1 px-6 py-3 text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors font-medium"
                                    >
                                      Supprimer
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}

                    {harvests.length === 0 && (
                      <div className="text-center py-16 bg-white rounded-xl">
                        <Sprout className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold text-gray-600 mb-2">
                          Aucune culture enregistrée
                        </h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                          Commencez par ajouter votre première culture pour
                          suivre vos performances agricoles.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </ChartContainer>
            )}
            {activeTab === 'calendar' && (
              <div className="grid gap-6 rounded-xl">
                <CropCalendarComponent />
              </div>
            )}
          </div>
        </div>

        {/* Footer Statistiques */}
        <div className="bg-gradient-to-r from-white via-blue-50 to-green-50 rounded-3xl shadow-lg border border-gray-100 p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {fields.size}
              </div>
              <div className="text-sm text-gray-600">Hectares cultivables</div>
            </div>
            <div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {members.length}
              </div>
              <div className="text-sm text-gray-600">Agriculteurs membres</div>
            </div>
            <div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {formatDate(fields.createdDate)}
              </div>
              <div className="text-sm text-gray-600">Jour de création</div>
            </div>
            <div>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                +12.7%
              </div>
              <div className="text-sm text-gray-600">Croissance annuelle</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SenegalFarmDashboard;
