'use client';

import React, { useState, useEffect } from 'react';
import {
  Globe,
  MapPin,
  Home,
  Building,
  Plus,
  Search,
  Check,
  X,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Map,
  Navigation,
  Flag,
  TreePine,
  Mountain,
  AlertCircle,
} from 'lucide-react';
import {
  createCountry,
  createRegion,
  createCommune,
  createVillage,
  getLocationsPayload,
  getCountries,
  getRegionsByCountry,
  getCommunesByRegion,
  getVillagesByCommune,
  patchCountry,
  patchRegion,
  patchCommune,
  patchVillage,
  deleteVillage,
  deleteCommune,
  deleteRegion,
  deleteCountry,
} from './api/locations';

type Country = {
  id: string;
  name: string;
  code: string;
  flag?: string;
  count: { regions: number; communes: number; villages: number };
};

type Region = {
  id: string;
  name: string;
  countryId: string;
  count: { communes: number; villages: number };
};

type Commune = {
  id: string;
  name: string;
  regionId: string;
  count: { villages: number };
};

type Village = {
  id: string;
  name: string;
};

type LocationsState = {
  countries: Country[];
  regions: Record<string, Region[]>;
  communes: Record<string, Commune[]>;
  villages: Record<string, Village[]>;
};

type Expanded = Record<string, boolean>;

export default function LocationManagement() {
  const [activeTab, setActiveTab] = useState('country');
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Expanded>({});
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [locations, setLocations] = useState<LocationsState>({
    countries: [],
    regions: {},
    communes: {},
    villages: {},
  });
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(
    null
  );
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [selectedCommuneId, setSelectedCommuneId] = useState<string | null>(
    null
  );
  const [editingCountry, setEditingCountry] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [editingRegion, setEditingRegion] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [editingCommune, setEditingCommune] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [editingVillage, setEditingVillage] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Formulaires pour chaque type
  const [newLocation, setNewLocation] = useState({
    country: { name: '', code: '', flag: '' },
    region: { name: '', countryId: '' },
    commune: { name: '', countryId: '', regionId: '' },
    village: { name: '', countryId: '', regionId: '', communeId: '' },
  });

  useEffect(() => {
    (async () => {
      try {
        const payload = await getLocationsPayload(); // appelle /locations/payload
        setLocations(payload); // remplit tout le state d'un coup
      } catch (e) {
        console.error('Erreur lors du chargement des localisations', e);
      }
    })();
  }, []);

  useEffect(() => {
    if (activeTab === 'country') openCountries();
  }, [activeTab]);

  // Régions : quand un pays est sélectionné
  useEffect(() => {
    if (activeTab === 'region' && selectedCountryId) {
      openRegions(selectedCountryId);
      // pré-remplir le form "region"
      setNewLocation((prev) => ({
        ...prev,
        region: { ...prev.region, countryId: selectedCountryId },
      }));
    }
  }, [activeTab, selectedCountryId]);

  // Communes : quand une région est sélectionnée
  useEffect(() => {
    if (activeTab === 'commune' && selectedRegionId) {
      openCommunes(selectedRegionId);
      // pré-remplir le form "commune"
      setNewLocation((prev) => ({
        ...prev,
        commune: { ...prev.commune, regionId: selectedRegionId },
      }));
    }
  }, [activeTab, selectedRegionId]);

  // Villages : quand une commune est sélectionnée
  useEffect(() => {
    if (activeTab === 'village' && selectedCommuneId) {
      openVillages(selectedCommuneId);
      // pré-remplir le form "village"
      setNewLocation((prev) => ({
        ...prev,
        village: { ...prev.village, communeId: selectedCommuneId },
      }));
    }
  }, [activeTab, selectedCommuneId]);

  async function openCountries() {
    try {
      const list = await getCountries();
      setLocations((prev) => ({ ...prev, countries: list }));
    } catch (e) {
      console.error(e);
    }
  }

  async function openRegions(countryId: string) {
    if (!countryId) return;
    try {
      const list = await getRegionsByCountry(countryId);
      setLocations((prev) => ({
        ...prev,
        regions: { ...prev.regions, [countryId]: list },
      }));
    } catch (e) {
      console.error(e);
    }
  }

  async function openCommunes(regionId: string) {
    if (!regionId) return;
    try {
      const list = await getCommunesByRegion(regionId);
      setLocations((prev) => ({
        ...prev,
        communes: { ...prev.communes, [regionId]: list },
      }));
    } catch (e) {
      console.error(e);
    }
  }

  async function openVillages(communeId: string) {
    if (!communeId) return;
    try {
      const list = await getVillagesByCommune(communeId);
      setLocations((prev) => ({
        ...prev,
        villages: { ...prev.villages, [communeId]: list },
      }));
    } catch (e) {
      console.error(e);
    }
  }

  // Stats
  const stats = {
    countries: locations.countries.length,
    regions: Object.values(locations.regions).flat().length,
    communes: Object.values(locations.communes).flat().length,
    villages: Object.values(locations.villages).flat().length,
  };

  // Tabs configuration
  const tabs = [
    {
      id: 'country',
      label: 'Pays',
      icon: Globe,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      id: 'region',
      label: 'Régions',
      icon: Map,
      color: 'green',
      gradient: 'from-green-500 to-green-600',
    },
    {
      id: 'commune',
      label: 'Communes',
      icon: Building,
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      id: 'village',
      label: 'Villages',
      icon: Home,
      color: 'orange',
      gradient: 'from-orange-500 to-orange-600',
    },
  ];

  async function handleAdd() {
    setErrorMsg(null);
    setSubmitting(true);
    try {
      if (activeTab === 'country') {
        const { name, code, flag } = newLocation.country || {
          name: '',
          code: '',
          flag: '',
        };
        if (!name?.trim() || !code?.trim() || code.length !== 2) {
          throw new Error('Renseigne le nom du pays et un code à 2 lettres.');
        }
        await createCountry({
          name: name.trim(),
          code: code.trim().toUpperCase(),
          flag,
        });
      }

      if (activeTab === 'region') {
        const { name, countryId } = newLocation.region || {
          name: '',
          countryId: '',
        };
        if (!countryId || !name?.trim())
          throw new Error('Choisis un pays et donne un nom à la région.');
        await createRegion({ name: name.trim(), countryId });
      }

      if (activeTab === 'commune') {
        const { name, regionId } = newLocation.commune || {
          name: '',
          regionId: '',
        };
        if (!regionId || !name?.trim())
          throw new Error('Choisis une région et donne un nom à la commune.');
        await createCommune({ name: name.trim(), regionId });
      }

      if (activeTab === 'village') {
        const { name, communeId } = newLocation.village || {
          name: '',
          communeId: '',
        };
        if (!communeId || !name?.trim())
          throw new Error('Choisis une commune et donne un nom au village.');
        await createVillage({ name: name.trim(), communeId });
      }

      // Rafraîchir le payload pour mettre à jour tout l’arbre et les compteurs
      const refreshed = await getLocationsPayload();
      setLocations(refreshed);

      // Reset minimal du formulaire selon l’onglet
      setNewLocation((prev) => ({
        ...prev,
        country:
          activeTab === 'country'
            ? { name: '', code: '', flag: '' }
            : prev.country,
        region:
          activeTab === 'region' ? { name: '', countryId: '' } : prev.region,
        commune:
          activeTab === 'commune'
            ? { name: '', countryId: '', regionId: '' }
            : prev.commune,
        village:
          activeTab === 'village'
            ? { name: '', countryId: '', regionId: '', communeId: '' }
            : prev.village,
      }));

      setShowAddForm(false);
    } catch (err: any) {
      setErrorMsg(err?.message || "Oups, impossible d'ajouter.");
    } finally {
      setSubmitting(false);
    }
  }

  async function saveCountryEdit(
    countryId: string,
    patch: { name?: string; code?: string; flag?: string }
  ) {
    try {
      await patchCountry(countryId, patch);
      // soit tu re-fetch le payload complet :
      const payload = await getLocationsPayload();
      setLocations(payload);

      // ou Optimistic UI (facultatif, plus complexe) : modifie locations.countries directement
    } catch (e) {
      console.error(e);
    }
  }

  async function saveRegionEdit(
    regionId: string,
    patch: { name?: string; countryId?: string }
  ) {
    try {
      await patchRegion(regionId, patch);
      // recharger ce qu’il faut (au choix) :
      // 1) tout :
      // const p = await getLocationsPayload(); setLocations(p);
      // 2) uniquement les régions du pays concerné (si tu as l’info) :
      const countryId = patch.countryId ?? selectedCountryId;
      if (countryId) {
        const list = await getRegionsByCountry(countryId);
        setLocations((prev) => ({
          ...prev,
          regions: { ...prev.regions, [countryId]: list },
        }));
      } else {
        // fallback: full payload
        const p = await getLocationsPayload();
        setLocations(p);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function saveCommuneEdit(
    communeId: string,
    patch: { name?: string; regionId?: string }
  ) {
    try {
      await patchCommune(communeId, patch);
      const regionId = patch.regionId ?? selectedRegionId;
      if (regionId) {
        const list = await getCommunesByRegion(regionId);
        setLocations((prev) => ({
          ...prev,
          communes: { ...prev.communes, [regionId]: list },
        }));
      } else {
        const p = await getLocationsPayload();
        setLocations(p);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function saveVillageEdit(
    villageId: string,
    patch: { name?: string; communeId?: string }
  ) {
    try {
      await patchVillage(villageId, patch);
      const communeId = patch.communeId ?? selectedCommuneId;
      if (communeId) {
        const list = await getVillagesByCommune(communeId);
        setLocations((prev) => ({
          ...prev,
          villages: { ...prev.villages, [communeId]: list },
        }));
      } else {
        const p = await getLocationsPayload();
        setLocations(p);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleDeleteCountry(countryId: string) {
    if (!confirm('Supprimer ce pays ?')) return;
    try {
      await deleteCountry(countryId);
      // recharge tout l’arbre (simple et sûr)
      const payload = await getLocationsPayload();
      setLocations(payload);
    } catch (e) {
      console.error(e);
      alert('Impossible de supprimer');
    }
  }

  async function handleDeleteRegion(regionId: string, countryId: string) {
    if (!confirm('Supprimer cette région ?')) return;
    try {
      await deleteRegion(regionId);
      // recharge uniquement les régions du pays
      const list = await getRegionsByCountry(countryId);
      setLocations((prev) => ({
        ...prev,
        regions: { ...prev.regions, [countryId]: list },
      }));
    } catch (e) {
      console.error(e);
    }
  }

  async function handleDeleteCommune(communeId: string, regionId: string) {
    if (!confirm('Supprimer cette commune ?')) return;
    try {
      await deleteCommune(communeId);
      // recharge uniquement les régions du pays
      const list = await getCommunesByRegion(regionId);
      setLocations((prev) => ({
        ...prev,
        communes: { ...prev.communes, [regionId]: list },
      }));
    } catch (e) {
      console.error(e);
    }
  }

  async function handleDeleteVillage(villageId: string, communeId: string) {
    if (!confirm('Supprimer ce village ?')) return;
    try {
      await deleteVillage(villageId);
      // recharge uniquement les régions du pays
      const list = await getVillagesByCommune(communeId);
      setLocations((prev) => ({
        ...prev,
        villages: { ...prev.villages, [communeId]: list },
      }));
    } catch (e) {
      console.error(e);
    }
  }

  // Toggle expanded state
  const toggleExpanded = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Obtenir les drapeaux disponibles
  const availableFlags = [
    '🇸🇳',
    '🇲🇱',
    '🇧🇫',
    '🇬🇳',
    '🇨🇮',
    '🇹🇬',
    '🇧🇯',
    '🇳🇪',
    '🇲🇷',
    '🇬🇭',
  ];

  // Obtenir le nombre total selon le type
  const getLocationCount = (type, parentId) => {
    switch (type) {
      case 'regions':
        return locations.regions[parentId]?.length || 0;
      case 'communes':
        return locations.communes[parentId]?.length || 0;
      case 'villages':
        return locations.villages[parentId]?.length || 0;
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec gradient */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 pb-9">
        <div className=" bg-opacity-10">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                  <MapPin className="w-8 h-8" />
                  Gestion des Localisations
                </h1>
                <p className="text-blue-100">
                  Ajoutez et gérez les pays, régions, communes et villages
                </p>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Ajouter une localisation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              label: 'Pays',
              count: stats.countries,
              icon: Globe,
              color: 'blue',
              change: '+1',
            },
            {
              label: 'Régions',
              count: stats.regions,
              icon: Map,
              color: 'green',
              change: '+3',
            },
            {
              label: 'Communes',
              count: stats.communes,
              icon: Building,
              color: 'purple',
              change: '+5',
            },
            {
              label: 'Villages',
              count: stats.villages,
              icon: Home,
              color: 'orange',
              change: '+12',
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-14 h-14 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-2xl flex items-center justify-center`}
                >
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900">{stat.count}</h3>
              <p className="text-gray-600 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 mt-8">
        {/* Tabs et recherche */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Tabs */}
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={`Rechercher un ${
                  activeTab === 'country'
                    ? 'pays'
                    : activeTab === 'region'
                    ? 'une région'
                    : activeTab === 'commune'
                    ? 'une commune'
                    : 'village'
                }...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Contenu principal - Vue hiérarchique */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          {activeTab === 'country' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                Pays disponibles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {locations.countries.map((country) => (
                  <div
                    key={country.id}
                    className="group bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => {
                      toggleExpanded(country.id);
                      setSelectedCountryId(country.id);

                      // 👉 pré-remplir les parents pour les formulaires suivants
                      setNewLocation((prev) => ({
                        ...prev,
                        region: { ...prev.region, countryId: country.id },
                        commune: {
                          ...prev.commune,
                          countryId: country.id,
                          regionId: '',
                        }, // reset region
                        village: {
                          ...prev.village,
                          countryId: country.id,
                          regionId: '',
                          communeId: '',
                        }, // reset plus bas
                      }));
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-5xl">{country.flag}</span>
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">
                            {country.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Code: {country.code}
                          </p>
                          <button
                            onClick={() =>
                              setEditingCountry({
                                id: country.id,
                                name: country.name,
                              })
                            }
                          >
                            Éditer
                          </button>
                          <button
                            className="px-2 py-1 text-red-600 hover:bg-red-50 rounded"
                            onClick={() => handleDeleteCountry(country.id)}
                          >
                            Supprimer
                          </button>
                        </div>
                        {editingCountry?.id === country.id && (
                          <div className="flex gap-2">
                            <input
                              className="input"
                              value={editingCountry.name}
                              onChange={(e) =>
                                setEditingCountry((r) =>
                                  r ? { ...r, name: e.target.value } : r
                                )
                              }
                            />
                            <button
                              className="btn"
                              onClick={async () => {
                                await saveCountryEdit(country.id, {
                                  name: editingCountry!.name.trim(),
                                });
                                setEditingCountry(null);
                              }}
                            >
                              Enregistrer
                            </button>
                          </div>
                        )}
                      </div>
                      <ChevronRight
                        className={`w-5 h-5 text-gray-400 transform transition-transform ${
                          expandedItems[country.id] ? 'rotate-90' : ''
                        }`}
                      />
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <div className="bg-white rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {country.count.regions}
                        </p>
                        <p className="text-xs text-gray-600">Régions</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-purple-600">
                          {country.count.communes}
                        </p>
                        <p className="text-xs text-gray-600">Communes</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-orange-600">
                          {country.count.villages}
                        </p>
                        <p className="text-xs text-gray-600">Villages</p>
                      </div>
                    </div>

                    {expandedItems[country.id] && (
                      <div className="mt-4 pt-4 border-t border-blue-100">
                        <p className="text-sm text-gray-600 mb-2">
                          Régions principales:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {locations.regions[country.id]
                            ?.slice(0, 3)
                            .map((region) => (
                              <span
                                key={region.id}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                              >
                                {region.name}
                              </span>
                            ))}
                          {locations.regions[country.id]?.length > 3 && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                              +{locations.regions[country.id].length - 3} autres
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'region' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Map className="w-5 h-5 text-green-600" />
                Régions par pays
              </h3>
              {locations.countries.map((country) => (
                <div key={country.id} className="mb-6">
                  <div
                    className="flex items-center gap-3 mb-3 cursor-pointer group"
                    onClick={() => {
                      toggleExpanded(country.id);
                      setSelectedCountryId(country.id);

                      // 👉 pré-remplir les parents pour les formulaires suivants
                      setNewLocation((prev) => ({
                        ...prev,
                        region: { ...prev.region, countryId: country.id },
                        commune: {
                          ...prev.commune,
                          countryId: country.id,
                          regionId: '',
                        }, // reset region
                        village: {
                          ...prev.village,
                          countryId: country.id,
                          regionId: '',
                          communeId: '',
                        }, // reset plus bas
                      }));
                    }}
                  >
                    <span className="text-2xl">{country.flag}</span>
                    <h4 className="text-lg font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
                      {country.name}
                    </h4>
                    <ChevronRight
                      className={`w-5 h-5 text-gray-400 transform transition-transform ${
                        expandedItems[country.id] ? 'rotate-90' : ''
                      }`}
                    />
                    <span className="ml-auto text-sm text-gray-500">
                      {locations.regions[country.id]?.length || 0} régions
                    </span>
                  </div>

                  {expandedItems[country.id] && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ml-10">
                      {locations.regions[country.id]?.map((region) => (
                        <div
                          key={region.id}
                          className="bg-gradient-to-r from-green-50 to-white border border-green-200 rounded-xl p-4 hover:shadow-md transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium text-gray-800">
                              {region.name}
                            </h5>
                            <MapPin className="w-4 h-4 text-green-600" />
                            <button
                              onClick={() =>
                                setEditingRegion({
                                  id: region.id,
                                  name: region.name,
                                })
                              }
                            >
                              Éditer
                            </button>
                            <button
                              className="px-2 py-1 text-red-600 hover:bg-red-50 rounded"
                              onClick={() =>
                                handleDeleteRegion(region.id, country.id)
                              }
                            >
                              Supprimer
                            </button>
                          </div>
                          <div className="mt-2 flex gap-4 text-sm text-gray-600">
                            <span>{region.count.communes} communes</span>
                            <span>{region.count.villages} villages</span>
                          </div>
                          {editingRegion?.id === region.id && (
                            <div className="flex gap-2">
                              <input
                                className="input"
                                value={editingRegion.name}
                                onChange={(e) =>
                                  setEditingRegion((r) =>
                                    r ? { ...r, name: e.target.value } : r
                                  )
                                }
                              />
                              <button
                                className="btn"
                                onClick={async () => {
                                  await saveRegionEdit(region.id, {
                                    name: editingRegion!.name.trim(),
                                  });
                                  setEditingRegion(null);
                                }}
                              >
                                Enregistrer
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'commune' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Building className="w-5 h-5 text-purple-600" />
                Communes par région
              </h3>
              <div className="space-y-4">
                {Object.entries(locations.regions).map(
                  ([countryId, regions]) => {
                    const country = locations.countries.find(
                      (c) => c.id === countryId
                    );
                    return regions.map((region) => (
                      <div
                        key={region.id}
                        className="border border-gray-200 rounded-xl overflow-hidden"
                      >
                        <div
                          className="bg-gradient-to-r from-purple-50 to-white p-4 cursor-pointer flex items-center justify-between"
                          onClick={() => {
                            toggleExpanded(region.id);
                            setSelectedRegionId(region.id);

                            // 👉 pré-remplir les parents du form commune/village
                            setNewLocation((prev) => ({
                              ...prev,
                              commune: { ...prev.commune, regionId: region.id },
                              village: {
                                ...prev.village,
                                regionId: region.id,
                                communeId: '',
                              },
                            }));
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{country?.flag}</span>
                            <div>
                              <h4 className="font-semibold text-gray-800">
                                {region.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {country?.name}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">
                              {locations.communes[region.id]?.length || 0}{' '}
                              communes
                            </span>
                            <ChevronRight
                              className={`w-5 h-5 text-gray-400 transform transition-transform ${
                                expandedItems[region.id] ? 'rotate-90' : ''
                              }`}
                            />
                          </div>
                        </div>

                        {expandedItems[region.id] &&
                          locations.communes[region.id] && (
                            <div className="p-4 bg-gray-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {locations.communes[region.id].map((commune) => (
                                <div
                                  key={commune.id}
                                  className="bg-white rounded-lg p-3 border border-purple-200 hover:border-purple-400 transition-colors"
                                >
                                  <h5 className="font-medium text-gray-800">
                                    {commune.name}
                                  </h5>
                                  <button
                                    onClick={() =>
                                      setEditingCommune({
                                        id: commune.id,
                                        name: commune.name,
                                      })
                                    }
                                  >
                                    Éditer
                                  </button>
                                  <button
                                    className="px-2 py-1 text-red-600 hover:bg-red-50 rounded"
                                    onClick={() =>
                                      handleDeleteCommune(commune.id, region.id)
                                    }
                                  >
                                    Supprimer
                                  </button>
                                  {editingCommune?.id === commune.id && (
                                    <div className="flex gap-2">
                                      <input
                                        className="input"
                                        value={editingCommune.name}
                                        onChange={(e) =>
                                          setEditingCommune((r) =>
                                            r
                                              ? { ...r, name: e.target.value }
                                              : r
                                          )
                                        }
                                      />
                                      <button
                                        className="btn"
                                        onClick={async () => {
                                          await saveCommuneEdit(commune.id, {
                                            name: editingCommune!.name.trim(),
                                          });
                                          setEditingCommune(null);
                                        }}
                                      >
                                        Enregistrer
                                      </button>
                                    </div>
                                  )}
                                  <p className="text-sm text-gray-600 mt-1">
                                    {commune.count.villages} villages
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    ));
                  }
                )}
              </div>
            </div>
          )}

          {activeTab === 'village' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Home className="w-5 h-5 text-orange-600" />
                Villages par commune
              </h3>
              <div className="space-y-4">
                {Object.entries(locations.communes).map(
                  ([regionId, communes]) => {
                    const region = Object.values(locations.regions)
                      .flat()
                      .find((r) => r.id === regionId);
                    const country = locations.countries.find(
                      (c) => c.id === region?.countryId
                    );

                    return communes.map((commune) => (
                      <div
                        key={commune.id}
                        className="border border-gray-200 rounded-xl overflow-hidden"
                      >
                        <div
                          className="bg-gradient-to-r from-orange-50 to-white p-4 cursor-pointer flex items-center justify-between"
                          onClick={() => {
                            toggleExpanded(commune.id);
                            setSelectedCommuneId(commune.id);

                            // 👉 pré-remplir le parent du form village
                            setNewLocation((prev) => ({
                              ...prev,
                              village: {
                                ...prev.village,
                                communeId: commune.id,
                              },
                            }));
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{country?.flag}</span>
                            <div>
                              <h4 className="font-semibold text-gray-800">
                                {commune.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {region?.name}, {country?.name}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">
                              {locations.villages[commune.id]?.length || 0}{' '}
                              villages
                            </span>
                            <ChevronRight
                              className={`w-5 h-5 text-gray-400 transform transition-transform ${
                                expandedItems[commune.id] ? 'rotate-90' : ''
                              }`}
                            />
                          </div>
                        </div>

                        {expandedItems[commune.id] &&
                          locations.villages[commune.id] && (
                            <div className="p-4 bg-gray-50 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                              {locations.villages[commune.id].map((village) => (
                                <div
                                  key={village.id}
                                  className="bg-white rounded-lg px-4 py-2 border border-orange-200 hover:border-orange-400 transition-colors text-center"
                                >
                                  <p className="text-sm font-medium text-gray-800">
                                    {village.name}
                                  </p>
                                  <button
                                    onClick={() =>
                                      setEditingVillage({
                                        id: village.id,
                                        name: village.name,
                                      })
                                    }
                                  >
                                    Éditer
                                  </button>
                                  <button
                                    className="px-2 py-1 text-red-600 hover:bg-red-50 rounded"
                                    onClick={() =>
                                      handleDeleteVillage(village.id, commune.id)
                                    }
                                  >
                                    Supprimer
                                  </button>
                                  {editingVillage?.id === village.id && (
                                    <div className="flex gap-2">
                                      <input
                                        className="input"
                                        value={editingVillage.name}
                                        onChange={(e) =>
                                          setEditingVillage((r) =>
                                            r
                                              ? { ...r, name: e.target.value }
                                              : r
                                          )
                                        }
                                      />
                                      <button
                                        className="btn"
                                        onClick={async () => {
                                          await saveVillageEdit(village.id, {
                                            name: editingVillage!.name.trim(),
                                          });
                                          setEditingVillage(null);
                                        }}
                                      >
                                        Enregistrer
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    ));
                  }
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal d'ajout */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Header de la modal */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Ajouter une localisation
                  </h2>
                  <p className="text-blue-100 mt-1">
                    Sélectionnez le type et remplissez les informations
                  </p>
                </div>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Contenu de la modal */}
            <div className="p-6">
              {/* Sélection du type */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Que souhaitez-vous ajouter ?
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        activeTab === tab.id
                          ? `border-${tab.color}-500 bg-${tab.color}-50`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <tab.icon
                        className={`w-8 h-8 mx-auto mb-2 ${
                          activeTab === tab.id
                            ? `text-${tab.color}-600`
                            : 'text-gray-400'
                        }`}
                      />
                      <p
                        className={`text-sm font-medium ${
                          activeTab === tab.id
                            ? `text-${tab.color}-700`
                            : 'text-gray-600'
                        }`}
                      >
                        {tab.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Formulaire selon le type */}
              <div className="space-y-4">
                {activeTab === 'country' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom du pays
                      </label>
                      <input
                        type="text"
                        value={newLocation.country.name}
                        onChange={(e) =>
                          setNewLocation({
                            ...newLocation,
                            country: {
                              ...newLocation.country,
                              name: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
                        placeholder="Ex: Côte d'Ivoire"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Code pays (2 lettres)
                        </label>
                        <input
                          type="text"
                          value={newLocation.country.code}
                          onChange={(e) =>
                            setNewLocation({
                              ...newLocation,
                              country: {
                                ...newLocation.country,
                                code: e.target.value.toUpperCase(),
                              },
                            })
                          }
                          maxLength="2"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition-all uppercase"
                          placeholder="CI"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Drapeau
                        </label>
                        <div className="flex gap-2">
                          <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-center text-3xl">
                            {newLocation.country.flag || '🏳️'}
                          </div>
                          <select
                            value={newLocation.country.flag}
                            onChange={(e) =>
                              setNewLocation({
                                ...newLocation,
                                country: {
                                  ...newLocation.country,
                                  flag: e.target.value,
                                },
                              })
                            }
                            className="px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
                          >
                            <option value="">Choisir</option>
                            {availableFlags.map((flag) => (
                              <option key={flag} value={flag}>
                                {flag}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'region' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pays
                      </label>
                      <select
                        value={newLocation.region.countryId}
                        onChange={(e) =>
                          setNewLocation({
                            ...newLocation,
                            region: {
                              ...newLocation.region,
                              countryId: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-green-500 transition-all"
                      >
                        <option value="">Sélectionner un pays...</option>
                        {locations.countries.map((country) => (
                          <option key={country.id} value={country.id}>
                            {country.flag} {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom de la région
                      </label>
                      <input
                        type="text"
                        value={newLocation.region.name}
                        onChange={(e) =>
                          setNewLocation({
                            ...newLocation,
                            region: {
                              ...newLocation.region,
                              name: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-green-500 transition-all"
                        placeholder="Ex: Abidjan"
                        disabled={!newLocation.region.countryId}
                      />
                    </div>
                  </>
                )}

                {activeTab === 'commune' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pays
                      </label>
                      <select
                        value={newLocation.commune.countryId}
                        onChange={(e) =>
                          setNewLocation({
                            ...newLocation,
                            commune: {
                              ...newLocation.commune,
                              countryId: e.target.value,
                              regionId: '',
                            },
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-purple-500 transition-all"
                      >
                        <option value="">Sélectionner un pays...</option>
                        {locations.countries.map((country) => (
                          <option key={country.id} value={country.id}>
                            {country.flag} {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Région
                      </label>
                      <select
                        value={newLocation.commune.regionId}
                        onChange={(e) =>
                          setNewLocation({
                            ...newLocation,
                            commune: {
                              ...newLocation.commune,
                              regionId: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-purple-500 transition-all"
                        disabled={!newLocation.commune.countryId}
                      >
                        <option value="">Sélectionner une région...</option>
                        {locations.regions[newLocation.commune.countryId]?.map(
                          (region) => (
                            <option key={region.id} value={region.id}>
                              {region.name}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom de la commune
                      </label>
                      <input
                        type="text"
                        value={newLocation.commune.name}
                        onChange={(e) =>
                          setNewLocation({
                            ...newLocation,
                            commune: {
                              ...newLocation.commune,
                              name: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-purple-500 transition-all"
                        placeholder="Ex: Yopougon"
                        disabled={!newLocation.commune.regionId}
                      />
                    </div>
                  </>
                )}

                {activeTab === 'village' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pays
                      </label>
                      <select
                        value={newLocation.village.countryId}
                        onChange={(e) =>
                          setNewLocation({
                            ...newLocation,
                            village: {
                              ...newLocation.village,
                              countryId: e.target.value,
                              regionId: '',
                              communeId: '',
                            },
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-orange-500 transition-all"
                      >
                        <option value="">Sélectionner un pays...</option>
                        {locations.countries.map((country) => (
                          <option key={country.id} value={country.id}>
                            {country.flag} {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Région
                      </label>
                      <select
                        value={newLocation.village.regionId}
                        onChange={(e) =>
                          setNewLocation({
                            ...newLocation,
                            village: {
                              ...newLocation.village,
                              regionId: e.target.value,
                              communeId: '',
                            },
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-orange-500 transition-all"
                        disabled={!newLocation.village.countryId}
                      >
                        <option value="">Sélectionner une région...</option>
                        {locations.regions[newLocation.village.countryId]?.map(
                          (region) => (
                            <option key={region.id} value={region.id}>
                              {region.name}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Commune
                      </label>
                      <select
                        value={newLocation.village.communeId}
                        onChange={(e) =>
                          setNewLocation({
                            ...newLocation,
                            village: {
                              ...newLocation.village,
                              communeId: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-orange-500 transition-all"
                        disabled={!newLocation.village.regionId}
                      >
                        <option value="">Sélectionner une commune...</option>
                        {locations.communes[newLocation.village.regionId]?.map(
                          (commune) => (
                            <option key={commune.id} value={commune.id}>
                              {commune.name}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom du village
                      </label>
                      <input
                        type="text"
                        value={newLocation.village.name}
                        onChange={(e) =>
                          setNewLocation({
                            ...newLocation,
                            village: {
                              ...newLocation.village,
                              name: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-orange-500 transition-all"
                        placeholder="Ex: Niangon"
                        disabled={!newLocation.village.communeId}
                      />
                    </div>
                  </>
                )}

                {/* Message d'information */}
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-gray-700">
                      <p className="font-medium mb-1">
                        Hiérarchie des localisations
                      </p>
                      <p>Pays → Régions → Communes → Villages</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Chaque niveau doit être créé dans l'ordre pour maintenir
                        la structure
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer de la modal */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleAdd}
                disabled={submitting}
                className={`px-6 py-3 rounded-xl font-medium transition-all bg-gradient-to-r ${
                  activeTab === 'country'
                    ? 'from-blue-600 to-blue-700'
                    : activeTab === 'region'
                    ? 'from-green-600 to-green-700'
                    : activeTab === 'commune'
                    ? 'from-purple-600 to-purple-700'
                    : 'from-orange-600 to-orange-700'
                } text-white hover:shadow-lg transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {submitting
                  ? 'Ajout...'
                  : `Ajouter ${
                      activeTab === 'country'
                        ? 'le pays'
                        : activeTab === 'region'
                        ? 'la région'
                        : activeTab === 'commune'
                        ? 'la commune'
                        : 'le village'
                    }`}
              </button>

              {errorMsg && (
                <div className="mt-2 text-sm text-red-600">{errorMsg}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast de succès */}
      {showSuccess && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-in">
          <Check className="w-6 h-6" />
          <p className="font-medium">Localisation ajoutée avec succès !</p>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
