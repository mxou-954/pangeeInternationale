"use client"

import React, { useState, useEffect } from 'react';
import { useParams } from "next/navigation";
import NewFieldModal from '@/app/components/newField/newField';
import {
    Calendar,
    Droplets,
    Sprout,
    TrendingUp,
    MapPin,
    Sun,
    Cloud,
    Thermometer,
    BarChart3,
    PieChart,
    Settings,
    Bell,
    Plus,
    Edit,
    Trash2,
    Save,
    Eye,
    Target,
    Leaf,
    Wheat,
    Activity,
    AlertTriangle,
    CheckCircle,
    Clock,
    Calculator,
    Download,
    Upload,
    Filter,
    icons,
    ShoppingCart,

} from 'lucide-react';
import { LineChart, Pie, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, AreaChart, Area, Label } from 'recharts';

const AgriculturalDashboard = () => {
    const params = useParams<{ farmerId: string }>();
    const farmerId = params.farmerId;
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showModal, setShowModal] = useState(false);
    const [selectedField, setSelectedField] = useState(null);
    const [weatherData, setWeatherData] = useState({
        temperature: 22,
        humidity: 65,
        precipitation: 12,
        windSpeed: 8,
        forecast: 'Ensoleillé'
    });

    useEffect(() => {
        console.log(farmerId)
        fetch(`http://localhost:3005/field/${farmerId}`, {
            method : "GET"
        })
        .then((response) => response.json())
        .then((data) => {
            setFields(data)
        })
    }, [farmerId])



    // États pour les données agricoles
    const [fields, setFields] = useState([]);



const handleNewField = async (fieldData) => {
  const { farmerId: _, ...cleanedField } = fieldData; // on ignore farmerId venant du formulaire

  try {
    const response = await fetch(`http://localhost:3005/field/${farmerId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cleanedField),
    });

    if (response.ok) {
      const data = await response.json();
      setFields([...fields, data]);
      console.log(data);
    } else {
      console.error("Une erreur a été détectée");
    }
  } catch (err) {
    console.error("Une erreur a été détectée : ", err);
  }
};

const handleRedirectionField = async (fieldId : string) => {
    window.location.href = `/navigation/dashboard/${farmerId}/field/${fieldId}`
}








    const [activities, setActivities] = useState([
        { id: 1, date: "2024-07-19", type: "Arrosage", field: "Champ Sud", quantity: "500L", notes: "Arrosage matinal" },
        { id: 2, date: "2024-07-18", type: "Fertilisation", field: "Champ Nord", quantity: "25kg", notes: "Engrais NPK" },
        { id: 3, date: "2024-07-17", type: "Inspection", field: "Champ Sud", quantity: "-", notes: "Contrôle parasites" },
        { id: 4, date: "2024-07-15", type: "Récolte", field: "Champ Est", quantity: "1.2T", notes: "Récolte partielle" }
    ]);

    const [newActivity, setNewActivity] = useState({
        type: '',
        field: '',
        quantity: '',
        notes: '',
        date: new Date().toISOString().split('T')[0]
    });

    const [newField, setNewField] = useState({
  // Informations de base
  name: '',
  farmerId: farmerId,
  
  // Caractéristiques physiques
  size: '', // en hectares
  coordinates: {
    latitude: '',
    longitude: ''
  },
  address: '',
  altitude: '', // en mètres
  slope: '', // en pourcentage
  exposition: '', // Nord, Sud, Est, Ouest, Sud-Est, etc.
  
  // Caractéristiques du sol
  soilType: '', // Argileux, Sableux, Limoneux, Calcaire, etc.
  soilPH: '', // 0-14
  soilQuality: '', // Excellent, Bon, Moyen, Faible
  drainage: '', // Excellent, Bon, Moyen, Faible
  organicMatter: '', // en pourcentage
  lastSoilAnalysis: '', // date
  
  // Informations sur la culture
  cropType: '', // Blé, Maïs, Soja, Orge, etc.
  cropVariety: '', // variété spécifique
  plantingDate: '',
  expectedHarvestDate: '',
  rotationPlan: [], // array des cultures prévues sur plusieurs années
  
  // Infrastructure et équipements
  irrigationSystem: '', // Aspersion, Goutte-à-goutte, Gravitaire, Aucun
  irrigationCapacity: '', // L/h ou m³/h
  waterSource: '', // Puits, Rivière, Réseau, Réservoir
  fencing: false, // clôturé ou non
  storage: '', // présence de stockage sur place
  accessibility: '', // Excellente, Bonne, Difficile
  
  // Données historiques (si disponibles)
  previousCrops: [], // cultures des années précédentes
  averageYield: '', // rendement moyen historique en kg/ha
  lastPlowing: '',
  lastFertilization: '',
  previousTreatments: [],
  
  // Prévisions et budget
  expectedYield: '', // kg/ha espéré
  productionCost: '', // coût prévu par hectare
  expectedRevenue: '', // revenus espérés
  
  // Contraintes et risques
  climateRisks: [], // Gel, Grêle, Sécheresse, Inondation
  pestRisks: [], // risques de parasites connus
  diseaseHistory: [], // maladies observées précédemment
  
  // Informations légales et administratives
  ownershipType: '', // Propriété, Location, Fermage
  lease: {
    startDate: '',
    endDate: '',
    cost: '' // si location
  },
  certifications: [], // Bio, Label Rouge, AOP, etc.
  subsidiesEligible: [], // aides PAC, autres subventions
  
  // Métadonnées
  createdDate: new Date().toISOString().split('T')[0],
  status: 'planning', // planning, active, fallow, harvested
  notes: '',
  photos: [], // URLs des photos du champ
  
  // Objectifs et KPIs
  sustainabilityGoals: {
    waterReduction: '', // % de réduction visée
    chemicalReduction: '', // % de réduction pesticides/engrais
    carbonSequestration: '', // objectif carbone
    biodiversityIndex: '' // objectif biodiversité
  }
});

    const [analytics, setAnalytics] = useState({
        totalYield: 3450,
        totalArea: 8.5,
        averageYieldPerHa: 406,
        waterConsumption: 2500,
        fertiliserUsed: 150,
        profitMargin: 23.5
    });

    // Données pour les graphiques
    const yieldData = [
        { month: 'Jan', yield: 0, target: 0 },
        { month: 'Fév', yield: 0, target: 0 },
        { month: 'Mar', yield: 450, target: 400 },
        { month: 'Avr', yield: 890, target: 800 },
        { month: 'Mai', yield: 1200, target: 1100 },
        { month: 'Jun', yield: 1850, target: 1600 },
        { month: 'Jul', yield: 2450, target: 2200 }
    ];

    const [annualPlan, setAnnualPlan] = useState({
        seeds: { planned: 500, used: 320, unit: 'kg', cost: 2500 },
        water: { planned: 15000, used: 9800, unit: 'L', cost: 450 },
        fuel: { planned: 800, used: 520, unit: 'L', cost: 1200 },
        pesticides: { planned: 120, used: 85, unit: 'kg', cost: 980 },
        fertilizers: { planned: 300, used: 210, unit: 'kg', cost: 1500 },
        labor: { planned: 200, used: 130, unit: 'h', cost: 2600 }
    });

    const [helpRequests, setHelpRequests] = useState([
        { id: 1, type: 'financial', status: 'pending', amount: 2500, reason: 'Achat équipement irrigation', date: '2024-07-15' },
        { id: 2, type: 'technical', status: 'approved', amount: 0, reason: 'Formation pesticides bio', date: '2024-07-10' }
    ]);

    const [newHelpRequest, setNewHelpRequest] = useState({
        type: '',
        amount: '',
        reason: '',
        description: ''
    });


    const resourceData = [
        { name: 'Eau', used: 2500, budget: 3000 },
        { name: 'Engrais', used: 150, budget: 200 },
        { name: 'Pesticides', used: 45, budget: 60 },
        { name: 'Carburant', used: 320, budget: 400 }
    ];

    const cropDistribution = [
        { name: 'Blé', value: 40, color: '#8884d8' },
        { name: 'Maïs', value: 30, color: '#82ca9d' },
        { name: 'Soja', value: 20, color: '#ffc658' },
        { name: 'Orge', value: 10, color: '#ff7300' }
    ];

    const weatherTrend = [
        { day: 'Lun', temp: 22, humidity: 65 },
        { day: 'Mar', temp: 24, humidity: 58 },
        { day: 'Mer', temp: 26, humidity: 62 },
        { day: 'Jeu', temp: 23, humidity: 70 },
        { day: 'Ven', temp: 25, humidity: 55 },
        { day: 'Sam', temp: 27, humidity: 60 },
        { day: 'Dim', temp: 25, humidity: 68 }
    ];

    // Conseils intelligents basés sur les données
    const getSmartAdvice = () => {
        const advice = [];

        if (weatherData.humidity < 60) {
            advice.push({
                type: 'warning',
                title: 'Faible humidité détectée',
                message: 'Considérez un arrosage supplémentaire pour vos cultures sensibles.',
                icon: Droplets
            });
        }

        if (weatherData.temperature > 25) {
            advice.push({
                type: 'info',
                title: 'Température élevée',
                message: 'Arrosez tôt le matin ou tard le soir pour éviter l\'évaporation.',
                icon: Thermometer
            });
        }

        advice.push({
            type: 'success',
            title: 'Période optimale de croissance',
            message: 'Les conditions actuelles sont favorables à la croissance de vos cultures.',
            icon: CheckCircle
        });

        return advice;
    };

    const addActivity = () => {
        if (newActivity.type && newActivity.field) {
            const activity = {
                id: activities.length + 1,
                ...newActivity,
                date: newActivity.date || new Date().toISOString().split('T')[0]
            };
            setActivities([activity, ...activities]);
            setNewActivity({ type: '', field: '', quantity: '', notes: '', date: new Date().toISOString().split('T')[0] });
        }
    };

    const StatCard = ({ title, value, unit, icon: Icon, trend, color = "blue" }) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                        {value} <span className="text-sm font-normal text-gray-500">{unit}</span>
                    </p>
                    {trend && (
                        <p className={`text-sm mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}% vs mois dernier
                        </p>
                    )}
                </div>
                <div className={`p-3 rounded-full bg-${color}-100`}>
                    <Icon className={`h-6 w-6 text-${color}-600`} />
                </div>
            </div>
        </div>
    );

    const WeatherWidget = () => (
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Météo Actuelle</h3>
                    <p className="text-blue-100">Rennes, Brittany</p>
                </div>
                <Sun className="h-8 w-8" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                    <p className="text-3xl font-bold">{weatherData.temperature}°C</p>
                    <p className="text-blue-100">{weatherData.forecast}</p>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4" />
                        <span className="text-sm">{weatherData.humidity}% humidité</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Cloud className="h-4 w-4" />
                        <span className="text-sm">{weatherData.precipitation}mm pluie</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderDashboard = () => (
        <div className="space-y-6">
            {/* Statistiques principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Rendement Total"
                    value={analytics.totalYield}
                    unit="kg"
                    icon={TrendingUp}
                    trend={12.5}
                    color="green"
                />
                <StatCard
                    title="Surface Totale"
                    value={analytics.totalArea}
                    unit="ha"
                    icon={MapPin}
                    trend={5.2}
                    color="blue"
                />
                <StatCard
                    title="Rendement/ha"
                    value={analytics.averageYieldPerHa}
                    unit="kg/ha"
                    icon={Target}
                    trend={8.1}
                    color="purple"
                />
                <StatCard
                    title="Consommation Eau"
                    value={analytics.waterConsumption}
                    unit="L"
                    icon={Droplets}
                    trend={-3.2}
                    color="cyan"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Graphique de rendement */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution du Rendement</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={yieldData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="yield" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                            <Area type="monotone" dataKey="target" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Widget météo */}
                <WeatherWidget />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Utilisation des ressources */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Utilisation des Ressources</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={resourceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="used" fill="#8884d8" name="Utilisé" />
                            <Bar dataKey="budget" fill="#82ca9d" name="Budget" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Distribution des cultures */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribution des Cultures</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <RechartsPieChart>
                            <Pie
                                data={cropDistribution}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, value }) => `${name}: ${value}%`}
                            >
                                {cropDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </RechartsPieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Conseils intelligents */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Conseils Intelligents</h3>
                <div className="space-y-3">
                    {getSmartAdvice().map((advice, index) => {
                        const Icon = advice.icon;
                        return (
                            <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${advice.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                                    advice.type === 'info' ? 'bg-blue-50 border border-blue-200' :
                                        'bg-green-50 border border-green-200'
                                }`}>
                                <Icon className={`h-5 w-5 mt-0.5 ${advice.type === 'warning' ? 'text-yellow-600' :
                                        advice.type === 'info' ? 'text-blue-600' :
                                            'text-green-600'
                                    }`} />
                                <div>
                                    <h4 className="font-medium text-gray-900">{advice.title}</h4>
                                    <p className="text-sm text-gray-600">{advice.message}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

  const renderFields = () => (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Gestion des Champs</h2>
            <button
                onClick={() => setShowModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
                <Plus className="h-4 w-4" />
                Nouveau Champ
            </button>
        </div>

        {showModal && (
            <NewFieldModal 
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={(fieldData) => {
                    console.log(fieldData);
                    handleNewField(fieldData)
                    setFields([...fields, fieldData]);
                    setShowModal(false);
                }}
            />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fields.map(field => (
                <div key={field.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    {/* Header avec nom et actions */}
                    <div onClick={() => handleRedirectionField(field.id)} className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">{field.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                    {field.ownershipType || 'Propriété'}
                                </span>
                                {field.certifications && field.certifications.length > 0 && (
                                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                                        {field.certifications[0]}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="text-gray-400 hover:text-blue-600">
                                <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-gray-400 hover:text-red-600">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Informations principales */}
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Surface:</span>
                            <span className="text-sm font-medium">{field.size} ha</span>
                        </div>
                        
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Culture:</span>
                            <span className="text-sm font-medium">
                                {field.cropType || field.crop}
                                {field.cropVariety && (
                                    <span className="text-xs text-gray-500 ml-1">({field.cropVariety})</span>
                                )}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Type de sol:</span>
                            <span className="text-sm font-medium">{field.soilType || 'Non défini'}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Irrigation:</span>
                            <span className="text-sm font-medium">{field.irrigationSystem || 'Aucun'}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Plantation:</span>
                            <span className="text-sm font-medium">
                                {field.plantingDate ? new Date(field.plantingDate).toLocaleDateString() : 'Non planifiée'}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Récolte prévue:</span>
                            <span className="text-sm font-medium">
                                {field.expectedHarvestDate ? new Date(field.expectedHarvestDate).toLocaleDateString() : field.expectedHarvest ? new Date(field.expectedHarvest).toLocaleDateString() : 'Non définie'}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Rendement espéré:</span>
                            <span className="text-sm font-medium">
                                {field.expectedYield ? `${field.expectedYield} kg/ha` : `${field.currentYield || 0} kg`}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Statut:</span>
                            <span className={`text-sm font-medium px-2 py-1 rounded-full text-xs ${
                                field.status === 'active' || field.status === 'En croissance' ? 'bg-yellow-100 text-yellow-800' :
                                field.status === 'harvested' || field.status === 'Mature' ? 'bg-green-100 text-green-800' :
                                field.status === 'planning' || field.status === 'En préparation' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                                {field.status === 'active' ? 'En croissance' :
                                 field.status === 'planning' ? 'En préparation' :
                                 field.status === 'harvested' ? 'Récolté' :
                                 field.status || 'Non défini'}
                            </span>
                        </div>
                    </div>

                    {/* Section économique */}
                    {(field.productionCost || field.expectedRevenue) && (
                        <div className="mt-4 pt-3 border-t border-gray-100">
                            <div className="text-xs font-medium text-gray-700 mb-2">Économie (€/ha)</div>
                            <div className="flex justify-between text-sm">
                                {field.productionCost && (
                                    <span className="text-red-600">Coût: {field.productionCost}€</span>
                                )}
                                {field.expectedRevenue && (
                                    <span className="text-green-600">Revenus: {field.expectedRevenue}€</span>
                                )}
                            </div>
                            {field.productionCost && field.expectedRevenue && (
                                <div className="text-xs text-center mt-1 font-medium text-blue-600">
                                    Marge: {field.expectedRevenue - field.productionCost}€/ha
                                </div>
                            )}
                        </div>
                    )}

                    {/* Risques et alertes */}
                    {field.climateRisks && field.climateRisks.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-gray-100">
                            <div className="text-xs font-medium text-gray-700 mb-2">Risques climatiques</div>
                            <div className="flex flex-wrap gap-1">
                                {field.climateRisks.slice(0, 3).map(risk => (
                                    <span key={risk} className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">
                                        {risk}
                                    </span>
                                ))}
                                {field.climateRisks.length > 3 && (
                                    <span className="text-xs text-gray-500">+{field.climateRisks.length - 3}</span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Barre de progression saisonnière */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-gray-500">Progression de la saison</span>
                            <span className="text-xs text-gray-500">
                                {field.accessibility && `Accès: ${field.accessibility}`}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full ${
                                    field.status === 'harvested' ? 'bg-green-600' :
                                    field.status === 'active' ? 'bg-yellow-500' :
                                    field.status === 'planning' ? 'bg-blue-500' :
                                    'bg-gray-400'
                                }`}
                                style={{ 
                                    width: field.status === 'harvested' ? '100%' :
                                           field.status === 'active' ? '65%' :
                                           field.status === 'planning' ? '15%' : '0%'
                                }}
                            ></div>
                        </div>
                    </div>

                    {/* Indicateurs de durabilité */}
                    {(field.sustainabilityGoals?.waterReduction || field.sustainabilityGoals?.chemicalReduction) && (
                        <div className="mt-3 flex gap-2">
                            {field.sustainabilityGoals.waterReduction && (
                                <div className="flex items-center gap-1 text-xs text-blue-600">
                                    <Droplets className="h-3 w-3" />
                                    <span>-{field.sustainabilityGoals.waterReduction}% eau</span>
                                </div>
                            )}
                            {field.sustainabilityGoals.chemicalReduction && (
                                <div className="flex items-center gap-1 text-xs text-green-600">
                                    <Leaf className="h-3 w-3" />
                                    <span>-{field.sustainabilityGoals.chemicalReduction}% chimique</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>
);

    const renderActivities = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Journal des Activités</h2>
                <div className="flex gap-3">
                    <button className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filtrer
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Exporter
                    </button>
                </div>
            </div>

            {/* Formulaire d'ajout rapide */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Nouvelle Activité</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <select
                        value={newActivity.type}
                        onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                        <option value="">Type d'activité</option>
                        <option value="Plantation">Plantation</option>
                        <option value="Arrosage">Arrosage</option>
                        <option value="Fertilisation">Fertilisation</option>
                        <option value="Labourage">Labourage</option>
                        <option value="Récolte">Récolte</option>
                        <option value="Inspection">Inspection</option>
                    </select>

                    <select
                        value={newActivity.field}
                        onChange={(e) => setNewActivity({ ...newActivity, field: e.target.value })}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                        <option value="">Champ</option>
                        {fields.map(field => (
                            <option key={field.id} value={field.name}>{field.name}</option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Quantité"
                        value={newActivity.quantity}
                        onChange={(e) => setNewActivity({ ...newActivity, quantity: e.target.value })}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />

                    <input
                        type="text"
                        placeholder="Notes"
                        value={newActivity.notes}
                        onChange={(e) => setNewActivity({ ...newActivity, notes: e.target.value })}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />

                    <button
                        onClick={addActivity}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Ajouter
                    </button>
                </div>
            </div>

            {/* Liste des activités */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Champ</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {activities.map((activity) => (
                                <tr key={activity.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(activity.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${activity.type === 'Arrosage' ? 'bg-blue-100 text-blue-800' :
                                                activity.type === 'Plantation' ? 'bg-green-100 text-green-800' :
                                                    activity.type === 'Récolte' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                            }`}>
                                            {activity.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{activity.field}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{activity.quantity}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{activity.notes}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex gap-2">
                                            <button className="text-blue-600 hover:text-blue-900">
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button className="text-red-600 hover:text-red-900">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderAnalytics = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Analyses et Rapports</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tendance météorologique */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendance Météorologique</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={weatherTrend}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis yAxisId="temp" orientation="left" />
                            <YAxis yAxisId="humidity" orientation="right" />
                            <Tooltip />
                            <Line yAxisId="temp" type="monotone" dataKey="temp" stroke="#8884d8" name="Température (°C)" />
                            <Line yAxisId="humidity" type="monotone" dataKey="humidity" stroke="#82ca9d" name="Humidité (%)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Efficacité par champ */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Efficacité par Champ</h3>
                    <div className="space-y-4">
                        {fields.map(field => (
                            <div key={field.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <h4 className="font-medium text-gray-900">{field.name}</h4>
                                    <p className="text-sm text-gray-600">{field.crop} - {field.size} ha</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">{Math.round(field.currentYield / field.size)} kg/ha</p>
                                    <div className="flex items-center gap-1">
                                        <div className={`w-2 h-2 rounded-full ${field.currentYield / field.size > 400 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                        <span className="text-xs text-gray-500">
                                            {field.currentYield / field.size > 400 ? 'Excellent' : 'Bon'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Analyse financière */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Analyse Financière</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <h4 className="text-lg font-semibold text-green-800">Revenus Estimés</h4>
                        <p className="text-2xl font-bold text-green-600">€8,750</p>
                        <p className="text-sm text-green-600">+15% vs prévisions</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <h4 className="text-lg font-semibold text-blue-800">Coûts d'Exploitation</h4>
                        <p className="text-2xl font-bold text-blue-600">€6,200</p>
                        <p className="text-sm text-blue-600">-8% vs budget</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <h4 className="text-lg font-semibold text-purple-800">Marge Bénéficiaire</h4>
                        <p className="text-2xl font-bold text-purple-600">{analytics.profitMargin}%</p>
                        <p className="text-sm text-purple-600">+3.2% vs année dernière</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderAsk = () => {
        const resourceData = Object.entries(annualPlan).map(([key, value]) => ({
            name: key === 'seeds' ? 'Graines' :
                key === 'water' ? 'Eau' :
                    key === 'fuel' ? 'Carburant' :
                        key === 'pesticides' ? 'Pesticides' :
                            key === 'fertilizers' ? 'Engrais' : 'Main d\'œuvre',
            planned: value.planned,
            used: value.used,
            remaining: value.planned - value.used,
            efficiency: Math.round((value.used / value.planned) * 100),
            cost: value.cost,
            unit: value.unit
        }));

        const budgetComparison = [
            { month: 'Jan', budget: 2000, actual: 1800, forecast: 1900 },
            { month: 'Fév', budget: 2200, actual: 2100, forecast: 2150 },
            { month: 'Mar', budget: 3500, actual: 3200, forecast: 3400 },
            { month: 'Avr', budget: 4000, actual: 4200, forecast: 4100 },
            { month: 'Mai', budget: 3800, actual: 3600, forecast: 3700 },
            { month: 'Jun', budget: 4200, actual: 4000, forecast: 4100 },
            { month: 'Jul', budget: 3600, actual: 3400, forecast: 3500 }
        ];

        const riskAlerts = [
            {
                type: 'warning',
                title: 'Budget eau insuffisant',
                message: 'Vous avez déjà utilisé 65% de votre budget eau annuel',
                severity: 'high',
                recommendation: 'Considérez une demande d\'aide pour système d\'irrigation plus efficace'
            },
            {
                type: 'info',
                title: 'Économies sur les pesticides',
                message: 'Vous êtes 15% en dessous du budget pesticides prévu',
                severity: 'low',
                recommendation: 'Excellent travail sur l\'agriculture biologique'
            },
            {
                type: 'critical',
                title: 'Carburant critique',
                message: 'Budget carburant dépassé de 120€, impact sur rentabilité',
                severity: 'critical',
                recommendation: 'Demande d\'aide urgente recommandée'
            }
        ];

        const submitHelpRequest = () => {
            if (newHelpRequest.type && newHelpRequest.reason) {
                const request = {
                    id: helpRequests.length + 1,
                    ...newHelpRequest,
                    status: 'pending',
                    date: new Date().toISOString().split('T')[0]
                };
                setHelpRequests([request, ...helpRequests]);
                setNewHelpRequest({ type: '', amount: '', reason: '', description: '' });
            }
        };

        const updateAnnualPlan = (resource, field, value) => {
            setAnnualPlan(prev => ({
                ...prev,
                [resource]: {
                    ...prev[resource],
                    [field]: parseFloat(value) || 0
                }
            }));
        };

        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">Planification Annuelle & Demandes d'Aide</h2>
                    <div className="flex gap-3">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                            <Calculator className="h-4 w-4" />
                            Recalculer Budget
                        </button>
                        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            Importer Plan
                        </button>
                    </div>
                </div>

                {/* Alertes de risque */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {riskAlerts.map((alert, index) => (
                        <div key={index} className={`p-4 rounded-lg border-l-4 ${alert.severity === 'critical' ? 'bg-red-50 border-red-500' :
                                alert.severity === 'high' ? 'bg-yellow-50 border-yellow-500' :
                                    'bg-blue-50 border-blue-500'
                            }`}>
                            <div className="flex items-start gap-3">
                                <AlertTriangle className={`h-5 w-5 mt-0.5 ${alert.severity === 'critical' ? 'text-red-600' :
                                        alert.severity === 'high' ? 'text-yellow-600' :
                                            'text-blue-600'
                                    }`} />
                                <div>
                                    <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                                    <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                                    <p className="text-xs text-gray-500 mt-2 italic">{alert.recommendation}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Planification des ressources */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Planification des Ressources Annuelles</h3>
                        <div className="space-y-4">
                            {Object.entries(annualPlan).map(([key, value]) => (
                                <div key={key} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="font-medium text-gray-900 capitalize">
                                            {key === 'seeds' ? 'Graines' :
                                                key === 'water' ? 'Eau' :
                                                    key === 'fuel' ? 'Carburant' :
                                                        key === 'pesticides' ? 'Pesticides' :
                                                            key === 'fertilizers' ? 'Engrais' : 'Main d\'œuvre'}
                                        </h4>
                                        <span className="text-sm text-gray-500">{value.unit}</span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3 mb-3">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Prévu</label>
                                            <input
                                                type="number"
                                                value={value.planned}
                                                onChange={(e) => updateAnnualPlan(key, 'planned', e.target.value)}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Utilisé</label>
                                            <input
                                                type="number"
                                                value={value.used}
                                                onChange={(e) => updateAnnualPlan(key, 'used', e.target.value)}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Coût (€)</label>
                                            <input
                                                type="number"
                                                value={value.cost}
                                                onChange={(e) => updateAnnualPlan(key, 'cost', e.target.value)}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-between text-sm mb-2">
                                        <span>Progression: {Math.round((value.used / value.planned) * 100)}%</span>
                                        <span className={`font-medium ${value.used > value.planned ? 'text-red-600' :
                                                value.used > value.planned * 0.8 ? 'text-yellow-600' : 'text-green-600'
                                            }`}>
                                            Restant: {value.planned - value.used} {value.unit}
                                        </span>
                                    </div>

                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${value.used > value.planned ? 'bg-red-500' :
                                                    value.used > value.planned * 0.8 ? 'bg-yellow-500' : 'bg-green-500'
                                                }`}
                                            style={{ width: `${Math.min((value.used / value.planned) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Demande d'aide à l'association */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Demander de l'Aide à l'Association</h3>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type d'aide</label>
                                <select
                                    value={newHelpRequest.type}
                                    onChange={(e) => setNewHelpRequest({ ...newHelpRequest, type: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">Sélectionner le type</option>
                                    <option value="financial">Aide financière</option>
                                    <option value="technical">Assistance technique</option>
                                    <option value="equipment">Prêt d'équipement</option>
                                    <option value="training">Formation</option>
                                    <option value="emergency">Aide d'urgence</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Montant demandé (€)</label>
                                <input
                                    type="number"
                                    value={newHelpRequest.amount}
                                    onChange={(e) => setNewHelpRequest({ ...newHelpRequest, amount: e.target.value })}
                                    placeholder="0"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Motif principal</label>
                                <input
                                    type="text"
                                    value={newHelpRequest.reason}
                                    onChange={(e) => setNewHelpRequest({ ...newHelpRequest, reason: e.target.value })}
                                    placeholder="Ex: Achat système irrigation"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description détaillée</label>
                                <textarea
                                    value={newHelpRequest.description}
                                    onChange={(e) => setNewHelpRequest({ ...newHelpRequest, description: e.target.value })}
                                    placeholder="Expliquez votre situation et pourquoi vous avez besoin d'aide..."
                                    rows={3}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <button
                                onClick={submitHelpRequest}
                                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Soumettre la demande
                            </button>
                        </div>

                        {/* Historique des demandes */}
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Historique des demandes</h4>
                            <div className="space-y-3 max-h-60 overflow-y-auto">
                                {helpRequests.map(request => (
                                    <div key={request.id} className="border border-gray-200 rounded-lg p-3">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-medium text-gray-900">{request.reason}</span>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {request.status === 'approved' ? 'Approuvé' :
                                                    request.status === 'pending' ? 'En attente' : 'Refusé'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>{request.type === 'financial' ? 'Aide financière' :
                                                request.type === 'technical' ? 'Assistance technique' : 'Autre'}</span>
                                            <span>{request.amount > 0 ? `${request.amount}€` : 'N/A'}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">{new Date(request.date).toLocaleDateString()}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Graphiques d'analyse */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Efficacité des ressources */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Efficacité des Ressources</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={resourceData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="efficiency" fill="#8884d8" name="Efficacité %" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Comparaison budget vs réel */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget vs Réel vs Prévisions</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={budgetComparison}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="budget" stroke="#8884d8" name="Budget" strokeDasharray="5 5" />
                                <Line type="monotone" dataKey="actual" stroke="#82ca9d" name="Réel" strokeWidth={2} />
                                <Line type="monotone" dataKey="forecast" stroke="#ffc658" name="Prévision" strokeDasharray="3 3" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Résumé financier */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé Financier Annuel</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <h4 className="text-sm font-medium text-blue-800">Budget Total Prévu</h4>
                            <p className="text-xl font-bold text-blue-600">
                                €{Object.values(annualPlan).reduce((sum, item) => sum + item.cost, 0).toLocaleString()}
                            </p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <h4 className="text-sm font-medium text-green-800">Économies Réalisées</h4>
                            <p className="text-xl font-bold text-green-600">€1,245</p>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                            <h4 className="text-sm font-medium text-yellow-800">Aide Demandée</h4>
                            <p className="text-xl font-bold text-yellow-600">
                                €{helpRequests.reduce((sum, req) => sum + (req.amount || 0), 0).toLocaleString()}
                            </p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <h4 className="text-sm font-medium text-purple-800">ROI Prévisionnel</h4>
                            <p className="text-xl font-bold text-purple-600">+18.5%</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <Wheat className="h-8 w-8 text-green-600" />
                            <h1 className="text-xl font-bold text-gray-900">AgroManager Pro</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="text-gray-400 hover:text-gray-600">
                                <Bell className="h-5 w-5" />
                            </button>
                            <button className="text-gray-400 hover:text-gray-600">
                                <Settings className="h-5 w-5" />
                            </button>
                            <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                JD
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Navigation */}
                <nav className="mb-8">
                    <div className="flex space-x-8">
                        {[
                            { id: 'dashboard', label: 'Tableau de Bord', icon: BarChart3 },
                            { id: 'fields', label: 'Champs', icon: MapPin },
                            { id: 'activities', label: 'Activités', icon: Activity },
                            { id: 'analytics', label: 'Analyses', icon: PieChart },
                            { id: 'ask', label: 'Demandes', icon: ShoppingCart }
                        ].map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${activeTab === tab.id
                                            ? 'bg-green-100 text-green-700'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </nav>

                {/* Contenu principal */}
                {activeTab === 'dashboard' && renderDashboard()}
                {activeTab === 'fields' && renderFields()}
                {activeTab === 'activities' && renderActivities()}
                {activeTab === 'analytics' && renderAnalytics()}
                {activeTab === 'ask' && renderAsk()}
            </div>
        </div>
    );
};

export default AgriculturalDashboard;