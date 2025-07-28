"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Plus,
  Search,
  Eye,
  EyeOff,
  MoreVertical,
  Edit,
  Trash2,
  Star,
  Copy,
  Check,
  X,
  Filter,
  Download,
  UserPlus,
  Phone,
  Mail,
  MapPin,
  Key,
  Users,
  TrendingUp,
  Globe,
  Calendar,
  CircleQuestionMark,
  Framer,
} from "lucide-react";

// FILES IMPORTS
import { Farmer } from "./utilities/interfaces/farmer";
import locations from "./utilities/json/zones_regions_communes_villages.json";
import ModalAdd from "./utilities/components/farmer/modalAdd";
import Success from "./utilities/components/popup/success";
import Error from "./utilities/components/popup/error";
import { stringify } from "querystring";

export default function AdminFarmers() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showCodes, setShowCodes] = useState({});
  const [activeMenu, setActiveMenu] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newFarmer, setNewFarmer] = useState({
    id: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    country: "",
    region: "",
    commune: "",
    village: "",
    code: "",
    isFavorite: false,
  });
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccessUpdate, setIsSuccessUpdate] = useState(false);
  const [isErrorUpdate, setIsErrorUpdate] = useState(false);
  const [isSuccessDelete, setIsSuccessDelete] = useState(false);
  const [isErrorDelete, setIsErrorDelete] = useState(false);
  const [isSuccessFavorite, setIsSuccessFavorite] = useState(false);
  const [isErrorFavorite, setIsErrorFavorite] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3005/farmer", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data: any) => {
        setFarmers([...data, ...farmers]);
      })
      .catch((err) => console.error("Une erreur s'est produite", err));
  }, []);

  const handleNewFarmer = async () => {
    console.log(newFarmer);
    const farmerWithCode = {
      ...newFarmer,
      code: generateCode(),
      status: "active",
    };
    const { id, ...farmerDataToSend } = farmerWithCode;

    console.log(farmerWithCode);
    try {
      const response = await fetch("http://localhost:3005/farmer/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(farmerDataToSend),
      });
      if (response.ok) {
        console.log("Les données ont été récupérés avec succes : ", response);
        const data = await response.json();
        setFarmers([data, ...farmers]);
        setIsSuccess(true);
        setNewFarmer({
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
          country: "",
          region: "",
          commune: "",
          village: "",
          code: "",
          isFavorite: false,
        });
        setShowAddForm(false);
        setIsEditMode(false);
      } else {
        console.error("Une erreur est apparu lors de la réponse");
        setIsError(true);
      }
    } catch (err) {
      setIsError(true);
      console.error(
        "Une erreur est apparu lors de l'envoieou la réception de la réponse : ",
        err
      );
    }
  };

  const filtersData = {
    filters: [
      { id: "praz", name: "Prénom : A-Z" },
      { id: "prza", name: "Prénom : Z-A" },
      { id: "noaz", name: "Nom : A-Z" },
      { id: "noza", name: "Nom : Z-A" },
      { id: "coaz", name: "Pays : A-Z" },
      { id: "coza", name: "Pays : Z-A" },
      { id: "reaz", name: "Région : A-Z" },
      { id: "reza", name: "Région : Z-A" },
      { id: "araz", name: "Arrondissement : A-Z" },
      { id: "arza", name: "Arrondissement : Z-A" },
      { id: "comaz", name: "Commune : A-Z" },
      { id: "comza", name: "Commune : Z-A" },
      { id: "viaz", name: "Village : A-Z" },
      { id: "viza", name: "Village : Z-A" },
      { id: "faaz", name: "Favoris : A-Z" },
      { id: "faza", name: "Favoris : Z-A" },
    ],
  };

  // Données de localisation complètes
  const locationData = {
    countries: [
      { id: "sn", name: "Sénégal", flag: "🇸🇳" },
      { id: "ml", name: "Mali", flag: "🇲🇱" },
      { id: "bf", name: "Burkina Faso", flag: "🇧🇫" },
    ],
    regions: {
      sn: [
        { id: "dakar", name: "Dakar" },
        { id: "thies", name: "Thiès" },
        { id: "casamance", name: "Casamance" },
        { id: "saintlouis", name: "Saint-Louis" },
      ],
      ml: [
        { id: "bamako", name: "Bamako" },
        { id: "sikasso", name: "Sikasso" },
        { id: "segou", name: "Ségou" },
      ],
      bf: [
        { id: "ouaga", name: "Ouagadougou" },
        { id: "bobo", name: "Bobo-Dioulasso" },
        { id: "koudougou", name: "Koudougou" },
      ],
    },
    communes: {
      // Sénégal
      dakar: [
        { id: "dakar-plateau", name: "Dakar-Plateau" },
        { id: "grand-dakar", name: "Grand Dakar" },
        { id: "parcelles", name: "Parcelles Assainies" },
        { id: "rufisque", name: "Rufisque" },
        { id: "pikine", name: "Pikine" },
      ],
      thies: [
        { id: "mbour", name: "Mbour" },
        { id: "tivaouane", name: "Tivaouane" },
        { id: "thies-ville", name: "Thiès Ville" },
      ],
      casamance: [
        { id: "ziguinchor", name: "Ziguinchor" },
        { id: "bignona", name: "Bignona" },
        { id: "oussouye", name: "Oussouye" },
      ],
      saintlouis: [
        { id: "saintlouis-ville", name: "Saint-Louis Ville" },
        { id: "richard-toll", name: "Richard Toll" },
        { id: "dagana", name: "Dagana" },
      ],
      // Mali
      bamako: [
        { id: "commune1", name: "Commune I" },
        { id: "commune2", name: "Commune II" },
        { id: "commune3", name: "Commune III" },
      ],
      sikasso: [
        { id: "sikasso-ville", name: "Sikasso Ville" },
        { id: "koutiala", name: "Koutiala" },
      ],
      segou: [
        { id: "segou-ville", name: "Ségou Ville" },
        { id: "markala", name: "Markala" },
      ],
      // Burkina Faso
      ouaga: [
        { id: "ouaga-centre", name: "Ouaga Centre" },
        { id: "tanghin", name: "Tanghin" },
      ],
      bobo: [
        { id: "bobo-centre", name: "Bobo Centre" },
        { id: "dafra", name: "Dafra" },
      ],
      koudougou: [{ id: "koudougou-ville", name: "Koudougou Ville" }],
    },
    villages: {
      // Communes du Sénégal
      mbour: [
        { id: "saly", name: "Saly Portudal" },
        { id: "ngaparou", name: "Ngaparou" },
        { id: "mballing", name: "Mballing" },
        { id: "warang", name: "Warang" },
      ],
      "thies-ville": [
        { id: "fahu", name: "Fahu" },
        { id: "thialy", name: "Thialy" },
        { id: "medina-fall", name: "Médina Fall" },
      ],
      rufisque: [
        { id: "sangalkam", name: "Sangalkam" },
        { id: "bambilor", name: "Bambilor" },
        { id: "yene", name: "Yène" },
      ],
      pikine: [
        { id: "thiaroye", name: "Thiaroye" },
        { id: "mbao", name: "Mbao" },
      ],
      ziguinchor: [
        { id: "diabir", name: "Diabir" },
        { id: "kandialang", name: "Kandialang" },
      ],
      bignona: [
        { id: "balinghore", name: "Balinghore" },
        { id: "sindian", name: "Sindian" },
      ],
      // Pour les autres communes, ajouter des villages par défaut
      "dakar-plateau": [{ id: "centre-ville", name: "Centre-ville" }],
      "grand-dakar": [
        { id: "grand-dakar-village", name: "Grand Dakar Village" },
      ],
      parcelles: [{ id: "unite1", name: "Unité 1" }],
      tivaouane: [{ id: "tivaouane-centre", name: "Tivaouane Centre" }],
      oussouye: [{ id: "oussouye-centre", name: "Oussouye Centre" }],
      "saintlouis-ville": [{ id: "guet-ndar", name: "Guet Ndar" }],
      "richard-toll": [
        { id: "richard-toll-centre", name: "Richard Toll Centre" },
      ],
      dagana: [{ id: "dagana-centre", name: "Dagana Centre" }],
      // Mali
      commune1: [{ id: "korofina", name: "Korofina" }],
      commune2: [{ id: "niarela", name: "Niaréla" }],
      commune3: [{ id: "dravela", name: "Dravéla" }],
      "sikasso-ville": [{ id: "wayerma", name: "Wayerma" }],
      koutiala: [{ id: "koutiala-centre", name: "Koutiala Centre" }],
      "segou-ville": [{ id: "pelengana", name: "Pélengana" }],
      markala: [{ id: "markala-centre", name: "Markala Centre" }],
      // Burkina Faso
      "ouaga-centre": [{ id: "koulouba", name: "Koulouba" }],
      tanghin: [{ id: "tanghin-centre", name: "Tanghin Centre" }],
      "bobo-centre": [{ id: "accart-ville", name: "Accart-Ville" }],
      dafra: [{ id: "dafra-centre", name: "Dafra Centre" }],
      "koudougou-ville": [{ id: "secteur1", name: "Secteur 1" }],
    },
  };

  // Générer un code aléatoire
  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
    let code = "";
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
      const response = await fetch(`http://localhost:3005/farmer/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("MAJ réussie :", data);

        setFarmers((prev) => prev.map((f) => (f.id === data.id ? data : f)));

        setIsSuccessUpdate(true);
        setNewFarmer(null);
        setShowAddForm(false);
        setIsEditMode(false);
      } else {
        setIsErrorUpdate(true);
      }
    } catch (err) {
      console.error("Erreur MAJ :", err);
      setIsErrorUpdate(true);
    }
  };

  const toggleFavorite = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3005/farmer/fav/${id}`, {
        method: "PATCH",
      });

      if (response.ok) {
        // 1️⃣ Créer une copie modifiée
        const updated = farmers.map((farmer) =>
          farmer.id === id
            ? { ...farmer, isFavorite: !farmer.isFavorite } // bascule
            : farmer
        );

        // 2️⃣ Mettre à jour le state
        setFarmers(updated);
        setIsSuccessFavorite(true);
      } else {
        setIsErrorFavorite(true);
        console.log("Une erreur lors de la réception de la réponse");
      }
    } catch (err) {
      setIsErrorFavorite(true);
      console.error(err);
    }

    setActiveMenu(null);
  };

  // Supprimer un agriculteur
  const deleteFarmer = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3005/farmer/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        console.log("Farmer correctement supprimé");
        setFarmers((prev) => prev.filter((f) => f.id !== id));
        setIsSuccessDelete(true);
      } else {
        console.error("Échec de la suppression");
        setIsErrorDelete(true);
      }
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
      setIsErrorDelete(true);
    }
    setActiveMenu(null);
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
      selectedCountry === "all" || farmer.country === selectedCountry;

    return matchesSearch && matchesCountry;
  });

  // Stats
  const stats = {
    total: farmers.length,
    active: farmers.filter((f) => f.status === "active").length,
    thisMonth: farmers.filter((f) => {
      const date = new Date(f.createdAt);
      const now = new Date();
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }).length,
    growth: "+12%",
  };

  const sortMap = {
    praz: { key: "firstName", asc: true },
    prza: { key: "firstName", asc: false },
    noaz: { key: "lastName", asc: true },
    noza: { key: "lastName", asc: false },
    coaz: { key: "country", asc: true },
    coza: { key: "country", asc: false },
    reaz: { key: "region", asc: true },
    reza: { key: "region", asc: false },
    comaz: { key: "commune", asc: true },
    comza: { key: "commune", asc: false },
    viaz: { key: "village", asc: true },
    viza: { key: "village", asc: false },
    faaz: { key: "isFavorite", asc: true },
    faza: { key: "isFavorite", asc: false },
  };

  const sortedFarmers = useMemo(() => {
    if (selectedFilter === "all") return filteredFarmers;

    const { key, asc } = sortMap[selectedFilter] || {};
    if (!key) return farmers;

    return [...filteredFarmers].sort((a, b) => {
      let aVal = a[key];
      let bVal = b[key];

      // handle undefined/null
      if (aVal == null) aVal = "";
      if (bVal == null) bVal = "";

      // Special case: isFavorite (boolean)
      if (typeof aVal === "boolean") {
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
      headers.map((h) => JSON.stringify(farmer[h as keyof Farmer] ?? ""))
    );

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "farmers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRedirection = async (id: string) => {
    window.location.href = `/utilities/pages/farmer/${id}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec gradient */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-green-600 pb-9">
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
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all transform hover:scale-105"
            >
              <UserPlus className="w-5 h-5" />
              Nouvel agriculteur
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards avec nouveau design */}
      <div className="container mx-auto px-6 -mt-8 relative z-10">
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
                            ID: #{farmer.id.toString().padStart(4, "0")}
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
                              ,{" "}
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
                          {showCodes[farmer.id] ? farmer.code : "••••••••"}
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
                          farmer.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full mr-2 ${
                            farmer.status === "active"
                              ? "bg-green-600"
                              : "bg-gray-600"
                          }`}
                        />
                        {farmer.status === "active" ? "Actif" : "Inactif"}
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
                                    ? "fill-yellow-500 text-yellow-500"
                                    : "text-gray-500"
                                }`}
                              />
                              {farmer.isFavorite
                                ? "Retirer des favoris"
                                : "Ajouter aux favoris"}
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
              Affichage de{" "}
              <span className="font-medium">{filteredFarmers.length}</span>{" "}
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
          {isSuccess && (
            <Success text="L'agriculteur a été créé avec succès." />
          )}
          {isError && (
            <Error text="Une erreur est survenue lors de la création de l'agriculteur." />
          )}
          {isSuccessUpdate && (
            <Success text="L'agriculteur a été modifié avec succès." />
          )}
          {isErrorUpdate && (
            <Error text="Une erreur est survenue lors de la modification de l'agriculteur." />
          )}
          {isSuccessDelete && (
            <Success text="L'agriculteur a été supprimé avec succès." />
          )}
          {isErrorDelete && (
            <Error text="Une erreur est survenue lors de la suppression de l'agriculteur." />
          )}
          {isSuccessFavorite && (
            <Success text="L'agriculteur a été mis en favori." />
          )}
          {isErrorFavorite && (
            <Error text="Une erreur est survenue lors de l'ajout en favori de l'agriculteur." />
          )}
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
    </div>
  );
}
