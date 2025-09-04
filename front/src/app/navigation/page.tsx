'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  Search,
  Eye,
  EyeOff,
  MoreVertical,
  Edit,
  Trash2,
  Star,
  Copy,
  Check,
  Download,
  UserPlus,
  Phone,
  Mail,
  MapPin,
  Users,
  TrendingUp,
  Globe,
  Calendar,
  CircleArrowOutDownRight,
  Settings,
  ChevronDown,
  FileText,
  VideoIcon,
} from 'lucide-react';
import { getLocationsPayload } from './admin/pages/addLocation/api/locations'; // notre fonction GET /locations/payload
import VideoModal from './VideoModal/VideoModal';

type LocationsState = {
  countries: Array<{ id: string; name: string; code: string; flag?: string }>;
  regions: Record<string, Array<{ id: string; name: string }>>;
  communes: Record<string, Array<{ id: string; name: string }>>;
  villages: Record<string, Array<{ id: string; name: string }>>;
};

const EMPTY_FARMER = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  country: '',
  region: '',
  commune: '',
  village: '',
  code: '',
  isFavorite: false,
};

// FILES IMPORTS
import { Farmer } from './admin/interfaces/farmer';
import ModalAdd from './admin/components/farmer/modalAdd';
import {
  createFarmer,
  deleteFarmerById,
  getAllFarmers,
  toggleFarmerFavorite,
  updateFarmer,
} from '../../../api/farmer';

export default function AdminFarmers() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showCodes, setShowCodes] = useState({});
  const [activeMenu, setActiveMenu] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newFarmer, setNewFarmer] = useState({
    id: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    country: '',
    region: '',
    commune: '',
    village: '',
    code: '',
    isFavorite: false,
  });
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [locationData, setLocationData] = useState<LocationsState>({
    countries: [],
    regions: {},
    communes: {},
    villages: {},
  });
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fermer le dropdown quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = () => {
    console.log('Export des données');
    setIsOpen(false);
    // Votre logique ici
  };

  const handleSettings = () => {
    console.log('Ouverture des paramètres');
    setIsOpen(false);
    // Votre logique ici
  };

  useEffect(() => {
    (async () => {
      try {
        const payload = await getLocationsPayload();
        setLocationData(payload);
      } catch (e: any) {
        console.error(e)
      }
    })();
  }, []);

  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        const data = await getAllFarmers({ signal: ac.signal });
        if (ac.signal.aborted) return;
        setFarmers(data as any[]); // remplace au lieu de [...data, ...farmers]
      } catch (err) {
        if (!ac.signal.aborted)
          console.error('Erreur chargement farmers:', err);
      }
    })();

    return () => ac.abort();
  }, []);

  const handleNewFarmer = async () => {
    const farmerWithCode = {
      ...newFarmer,
      code: generateCode(),
      status: 'active',
    };

    // ne PAS envoyer l'id si présent
    const { id, ...farmerDataToSend } = farmerWithCode;
    console.log('On envoie : ', farmerDataToSend);

    try {
      const created = await createFarmer(farmerDataToSend);

      // Ajout en tête (fonctionnel pour éviter l’état obsolète)
      setFarmers((prev) => [created, ...prev]);

      setNewFarmer(EMPTY_FARMER);
      setShowAddForm(false);
      setIsEditMode(false);
    } catch (err) {
      console.error('Erreur création farmer:', err);
    }
  };

  const filtersData = {
    filters: [
      { id: 'praz', name: 'Prénom : A-Z' },
      { id: 'prza', name: 'Prénom : Z-A' },
      { id: 'noaz', name: 'Nom : A-Z' },
      { id: 'noza', name: 'Nom : Z-A' },
      { id: 'coaz', name: 'Pays : A-Z' },
      { id: 'coza', name: 'Pays : Z-A' },
      { id: 'reaz', name: 'Région : A-Z' },
      { id: 'reza', name: 'Région : Z-A' },
      { id: 'araz', name: 'Arrondissement : A-Z' },
      { id: 'arza', name: 'Arrondissement : Z-A' },
      { id: 'comaz', name: 'Commune : A-Z' },
      { id: 'comza', name: 'Commune : Z-A' },
      { id: 'viaz', name: 'Village : A-Z' },
      { id: 'viza', name: 'Village : Z-A' },
      { id: 'faaz', name: 'Favoris : A-Z' },
      { id: 'faza', name: 'Favoris : Z-A' },
    ],
  };

  // Générer un code aléatoire
  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const openEditModal = (id: number) => {
    const farmer = farmers.find((f) => f.id === id);
    if (!farmer) return;

    setNewFarmer({
      id: farmer.id, // ← tu en auras besoin pour PATCH plus tard
      firstName: farmer.firstName,
      lastName: farmer.lastName,
      phone: farmer.phone,
      email: farmer.email,
      country: farmer.country,
      region: farmer.region,
      commune: farmer.commune,
      village: farmer.village,
      code: farmer.code,
      isFavorite: farmer.isFavorite,
    });

    setIsEditMode(true);
    setShowAddForm(true);
  };

  const handleUpdateFarmer = async () => {
    if (!newFarmer || !newFarmer.id) return;

    const { id, ...payload } = newFarmer;
    try {
      const data = await updateFarmer(String(id), payload);
      console.log('MAJ réussie :', data);

      setFarmers((prev) => prev.map((f) => (f.id === data.id ? data : f)));
      setNewFarmer(null);
      setShowAddForm(false);
      setIsEditMode(false);
    } catch (err) {
      console.error('Erreur MAJ :', err);
    }
  };

  // --- Toggle favori (optimistic) ---
  const toggleFavorite = async (id: string) => {
    // optimistic update
    setFarmers((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isFavorite: !f.isFavorite } : f))
    );
    try {
      await toggleFarmerFavorite(String(id));
    } catch (err) {
      console.error(err);
      setFarmers((prev) =>
        prev.map((f) => (f.id === id ? { ...f, isFavorite: !f.isFavorite } : f))
      );
    } finally {
      setActiveMenu(null);
    }
  };

  // --- Delete farmer ---
  const deleteFarmer = async (id: string) => {
    try {
      await deleteFarmerById(String(id));
      setFarmers((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression :', err);
    } finally {
      setActiveMenu(null);
    }
  };

  // Copier le code
  const copyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Filtrer les agriculteurs
  const filteredFarmers = farmers.filter((farmer) => {
    const matchesSearch =
      farmer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.phone.includes(searchTerm) ||
      farmer.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCountry =
      selectedCountry === 'all' || farmer.country === selectedCountry;

    return matchesSearch && matchesCountry;
  });

  // Stats
  const stats = {
    total: farmers.length,
    active: farmers.filter((f) => f.status === 'active').length,
    thisMonth: farmers.filter((f) => {
      const date = new Date(f.createdAt);
      const now = new Date();
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }).length,
    growth: '+12%',
  };

  const sortMap = {
    praz: { key: 'firstName', asc: true },
    prza: { key: 'firstName', asc: false },
    noaz: { key: 'lastName', asc: true },
    noza: { key: 'lastName', asc: false },
    coaz: { key: 'country', asc: true },
    coza: { key: 'country', asc: false },
    reaz: { key: 'region', asc: true },
    reza: { key: 'region', asc: false },
    comaz: { key: 'commune', asc: true },
    comza: { key: 'commune', asc: false },
    viaz: { key: 'village', asc: true },
    viza: { key: 'village', asc: false },
    faaz: { key: 'isFavorite', asc: true },
    faza: { key: 'isFavorite', asc: false },
  };

  const sortedFarmers = useMemo(() => {
    if (selectedFilter === 'all') return filteredFarmers;

    const { key, asc } = sortMap[selectedFilter] || {};
    if (!key) return farmers;

    return [...filteredFarmers].sort((a, b) => {
      let aVal = a[key];
      let bVal = b[key];

      // handle undefined/null
      if (aVal == null) aVal = '';
      if (bVal == null) bVal = '';

      // Special case: isFavorite (boolean)
      if (typeof aVal === 'boolean') {
        return asc ? bVal - aVal : aVal - bVal;
      }

      // default string comparison
      aVal = aVal.toString().toLowerCase();
      bVal = bVal.toString().toLowerCase();

      if (aVal < bVal) return asc ? -1 : 1;
      if (aVal > bVal) return asc ? 1 : -1;
      return 0;
    });
  }, [selectedFilter, filteredFarmers]);

  const exportToCSV = () => {
    if (!farmers.length) return;

    const headers = Object.keys(farmers[0]);
    const rows = farmers.map((farmer) =>
      headers.map((h) => JSON.stringify(farmer[h as keyof Farmer] ?? ''))
    );

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'farmers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRedirection = async (id: string) => {
    window.location.href = `/navigation/admin/pages/farmer/${id}`;
  };

  const handleRedirectionCountry = async () => {
    window.location.href = `/navigation/admin/pages/addLocation`;
  };

  const handleRedirectionVideos = async () => {
    window.location.href = `/navigation/admin/pages/addVideo`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec gradient */}
      <div className="relative overflow-visible bg-gradient-to-r from-blue-600 via-blue-700 to-green-600 pb-9">
        {/* Voile blanc flou */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl z-0 pointer-events-none" />

        {/* Contenu au-dessus */}
        <div className="container mx-auto px-6 py-8 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Tableau de bord Agriculteurs
              </h1>
              <p className="text-blue-100">
                Gérez et suivez vos agriculteurs partenaires
              </p>
            </div>
            <div className="relative inline-block z-40" ref={dropdownRef}>
              {/* Bouton principal */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-700 hover:shadow-lg transition-all transform hover:scale-105"
              >
                <Settings className="w-5 h-5" />
                Actions
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Menu déroulant */}
              {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="py-2">
                    {/* Bouton Ajouter des pays */}
                    <button
                      onClick={handleRedirectionCountry}
                      className="w-full text-left px-4 py-3 text-blue-600 font-medium flex items-center gap-3 hover:bg-blue-50 transition-colors"
                    >
                      <CircleArrowOutDownRight className="w-5 h-5" />
                      Ajouter des pays
                    </button>

                    {/* Bouton Nouvel agriculteur */}
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="w-full text-left px-4 py-3 text-blue-600 font-medium flex items-center gap-3 hover:bg-blue-50 transition-colors"
                    >
                      <UserPlus className="w-5 h-5" />
                      Nouvel agriculteur
                    </button>

                    <button
                      onClick={handleRedirectionVideos}
                      className="w-full text-left px-4 py-3 text-blue-600 font-medium flex items-center gap-3 hover:bg-blue-50 transition-colors"
                    >
                      <VideoIcon className="w-5 h-5" />
                      Ajouter une vidéo
                    </button>

                    {/* Séparateur */}
                    <div className="my-2 border-t border-gray-100"></div>

                    {/* Autres boutons d'exemple */}
                    <button
                      onClick={handleExport}
                      className="w-full text-left px-4 py-3 text-gray-700 font-medium flex items-center gap-3 hover:bg-gray-50 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      Exporter les données
                    </button>

                    <button
                      onClick={handleSettings}
                      className="w-full text-left px-4 py-3 text-gray-700 font-medium flex items-center gap-3 hover:bg-gray-50 transition-colors"
                    >
                      <FileText className="w-5 h-5" />
                      Générer un rapport
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards avec nouveau design */}
      <div className="container mx-auto px-6 -mt-8 relative z-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
              <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                {stats.growth}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{stats.total}</h3>
            <p className="text-gray-600 text-sm mt-1">Total agriculteurs</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{stats.active}</h3>
            <p className="text-gray-600 text-sm mt-1">Actifs</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Calendar className="w-7 h-7 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">
              +{stats.thisMonth}
            </h3>
            <p className="text-gray-600 text-sm mt-1">Ce mois-ci</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                <Globe className="w-7 h-7 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">3</h3>
            <p className="text-gray-600 text-sm mt-1">Pays couverts</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-8">
        {/* Barre de recherche et filtres améliorés */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par nom, téléphone, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
              />
            </div>

            <div className="flex gap-3 text-gray-700">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
              >
                <option value="all">🌍 Tous les pays</option>
                {locationData.countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
              >
                <option value="all">Aucun</option>
                {filtersData.filters.map((filtre) => (
                  <option key={filtre.id} value={filtre.id}>
                    {filtre.name}
                  </option>
                ))}
              </select>

              <button
                onClick={exportToCSV}
                className="px-5 text-gray-700 py-3.5 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all flex items-center gap-2"
              >
                <Download className="w-5 h-5 text-gray-600" />
                <span className="hidden sm:inline">Exporter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tableau amélioré */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Agriculteur
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Contact
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Localisation
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Code d'accès
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Statut
                    </span>
                  </th>
                  <th className="px-6 py-4 text-center">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedFarmers.map((farmer) => (
                  <tr
                    key={farmer.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td
                      className="px-6 py-5"
                      onClick={() => handleRedirection(farmer.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {farmer.firstName[0]}
                            {farmer.lastName[0]}
                          </div>
                          {farmer.isFavorite && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                              <Star className="w-3 h-3 text-white fill-current" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {farmer.firstName} {farmer.lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            ID: #{farmer.id.toString().padStart(4, '0')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {farmer.phone}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {farmer.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-start gap-2">
                        <a
                          target="_blank"
                          href={`https://www.google.fr/maps/search/${farmer.region}, ${farmer.commune}, ${farmer.village}/`}
                        >
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-700 font-medium">
                              {
                                locationData.villages[farmer.commune]?.find(
                                  (v) => v.id === farmer.village
                                )?.name
                              }
                            </p>
                            <p className="text-xs text-gray-500">
                              {
                                locationData.communes[farmer.region]?.find(
                                  (c) => c.id === farmer.commune
                                )?.name
                              }
                              ,{' '}
                              {
                                locationData.regions[farmer.country]?.find(
                                  (r) => r.id === farmer.region
                                )?.name
                              }
                            </p>
                          </div>
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <code className="font-mono text-sm bg-gray-100 text-gray-500 px-3 py-2 rounded-lg border border-gray-200">
                          {showCodes[farmer.id] ? farmer.code : '••••••••'}
                        </code>
                        <button
                          onClick={() =>
                            setShowCodes({
                              ...showCodes,
                              [farmer.id]: !showCodes[farmer.id],
                            })
                          }
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {showCodes[farmer.id] ? (
                            <EyeOff className="w-4 h-4 text-gray-500" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                        <button
                          onClick={() => copyCode(farmer.code, farmer.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {copiedCode === farmer.id ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          farmer.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full mr-2 ${
                            farmer.status === 'active'
                              ? 'bg-green-600'
                              : 'bg-gray-600'
                          }`}
                        />
                        {farmer.status === 'active' ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="relative flex justify-center">
                        <button
                          onClick={() =>
                            setActiveMenu(
                              activeMenu === farmer.id ? null : farmer.id
                            )
                          }
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-500" />
                        </button>

                        {activeMenu === farmer.id && (
                          <div className="text-gray-700 absolute right-0 mt-10 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 z-20 overflow-hidden">
                            <button
                              onClick={() => toggleFavorite(farmer.id)}
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-sm transition-colors"
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  farmer.isFavorite
                                    ? 'fill-yellow-500 text-yellow-500'
                                    : 'text-gray-500'
                                }`}
                              />
                              {farmer.isFavorite
                                ? 'Retirer des favoris'
                                : 'Ajouter aux favoris'}
                            </button>
                            <button
                              className="w-full text-gray-700 px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-sm transition-colors"
                              onClick={() => openEditModal(farmer.id)}
                            >
                              <Edit className="w-4 h-4 text-gray-500" />
                              Modifier les informations
                            </button>
                            <div className="border-t border-gray-100"></div>
                            <button
                              onClick={() => deleteFarmer(farmer.id)}
                              className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center gap-3 text-sm text-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              Supprimer l'agriculteur
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 bg-gray-100 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Affichage de{' '}
              <span className="font-medium">{filteredFarmers.length}</span>{' '}
              résultats
            </p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm text-gray-600 hover:bg-white rounded-lg transition-colors">
                Précédent
              </button>
              <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg">
                1
              </button>
              <button className="px-3 py-1 text-sm text-gray-600 hover:bg-white rounded-lg transition-colors">
                2
              </button>
              <button className="px-3 py-1 text-sm text-gray-600 hover:bg-white rounded-lg transition-colors">
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'ajout avec backdrop blur */}
      {showAddForm && newFarmer && (
        <ModalAdd
          newFarmer={newFarmer}
          setNewFarmer={setNewFarmer}
          setShowAddForm={setShowAddForm}
          locationData={locationData}
          handleNewFarmer={isEditMode ? handleUpdateFarmer : handleNewFarmer}
          isEditMode={isEditMode}
        />
      )}

      {showAddVideo && (
        <VideoModal 
        setShowAddVideo={setShowAddVideo}
        />
      )}
    </div>
  );
}
