"use client"

import React from 'react';
import { 
  MapPin, Calendar, Droplets, Mountain, Compass, 
  Beaker, Wheat, TrendingUp, AlertTriangle, Shield,
  Camera, FileText, Target, Clock, Euro, Leaf,
  Info, Home, Gauge, Trees, Bug, Cloud, Award,
  Calculator, BarChart3, Building2, Truck
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadialBarChart, RadialBar, Area, AreaChart
} from 'recharts';

const FieldDetailsPage = ({ field = {} }) => {
  // Données de démonstration si aucune donnée n'est fournie
  const demoField = {
    name: 'Parcelle Nord - Les Grands Champs',
    farmerId: 'FARM123',
    size: '25.5',
    coordinates: { latitude: '48.8566', longitude: '2.3522' },
    address: 'Route de la Ferme, 77000 Melun',
    altitude: '120',
    slope: '2.5',
    exposition: 'Sud-Est',
    soilType: 'Limoneux-argileux',
    soilPH: '6.8',
    soilQuality: 'Bon',
    drainage: 'Bon',
    organicMatter: '3.2',
    lastSoilAnalysis: '2024-03-15',
    cropType: 'Blé tendre d\'hiver',
    cropVariety: 'Apache',
    plantingDate: '2024-10-15',
    expectedHarvestDate: '2025-07-20',
    rotationPlan: ['Blé', 'Colza', 'Orge', 'Maïs'],
    irrigationSystem: 'Aspersion',
    irrigationCapacity: '50 m³/h',
    waterSource: 'Puits et réseau',
    fencing: true,
    storage: 'Silo 500T sur site',
    accessibility: 'Excellente',
    previousCrops: [
      { year: 2023, crop: 'Colza', yield: '3.8 t/ha' },
      { year: 2022, crop: 'Orge', yield: '7.2 t/ha' },
      { year: 2021, crop: 'Maïs', yield: '11.5 t/ha' }
    ],
    averageYield: '8.5',
    lastPlowing: '2024-11-20',
    lastFertilization: '2024-11-10',
    previousTreatments: ['Fongicide - Mars 2024', 'Herbicide - Novembre 2023'],
    expectedYield: '9.2',
    productionCost: '850',
    expectedRevenue: '1840',
    climateRisks: ['Gel tardif', 'Sécheresse estivale'],
    pestRisks: ['Pucerons', 'Limaces'],
    diseaseHistory: ['Septoriose - 2023', 'Rouille jaune - 2021'],
    ownershipType: 'Fermage',
    lease: {
      startDate: '2020-11-01',
      endDate: '2029-10-31',
      cost: '180 €/ha/an'
    },
    certifications: ['HVE Niveau 3', 'Agriculture Raisonnée'],
    subsidiesEligible: ['PAC - Aide de base', 'Aide verte', 'MAEC'],
    createdDate: '2024-01-15',
    status: 'active',
    notes: 'Parcelle très productive avec un bon potentiel. Attention particulière nécessaire pour la gestion de l\'eau en période estivale.',
    photos: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    sustainabilityGoals: {
      waterReduction: '15',
      chemicalReduction: '25',
      carbonSequestration: '2.5 tCO2/ha/an',
      biodiversityIndex: '7/10'
    }
  };

  const data = { ...demoField, ...field };

  const getStatusColor = (status) => {
    const colors = {
      planning: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      fallow: 'bg-yellow-100 text-yellow-800',
      harvested: 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      planning: 'En planification',
      active: 'En culture',
      fallow: 'En jachère',
      harvested: 'Récolté'
    };
    return labels[status] || status;
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.name}</h1>
              <div className="flex items-center gap-4 text-gray-600">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {data.address}
                </span>
                <span className="flex items-center gap-1">
                  <Gauge className="w-4 h-4" />
                  {data.size} hectares
                </span>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(data.status)}`}>
              {getStatusLabel(data.status)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Culture actuelle */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Wheat className="w-5 h-5 text-green-600" />
                Culture actuelle
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Type de culture</p>
                  <p className="font-medium">{data.cropType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Variété</p>
                  <p className="font-medium">{data.cropVariety}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date de semis</p>
                  <p className="font-medium">{formatDate(data.plantingDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Récolte prévue</p>
                  <p className="font-medium">{formatDate(data.expectedHarvestDate)}</p>
                </div>
              </div>
              
              {/* Barre de progression du cycle de culture */}
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Progression de la culture</p>
                <div className="relative">
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(() => {
                          const start = new Date(data.plantingDate);
                          const end = new Date(data.expectedHarvestDate);
                          const now = new Date();
                          const total = end - start;
                          const elapsed = now - start;
                          return Math.min(Math.max((elapsed / total) * 100, 0), 100);
                        })()}%` 
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">Semis</span>
                    <span className="text-xs text-gray-500">
                      {(() => {
                        const start = new Date(data.plantingDate);
                        const end = new Date(data.expectedHarvestDate);
                        const now = new Date();
                        const remaining = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
                        return remaining > 0 ? `${remaining} jours restants` : 'Prêt pour la récolte';
                      })()}
                    </span>
                    <span className="text-xs text-gray-500">Récolte</span>
                  </div>
                </div>
              </div>
              {data.rotationPlan && data.rotationPlan.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm text-gray-500 mb-3">Plan de rotation (4 ans)</p>
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      {data.rotationPlan.map((crop, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                            i === 0 ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100'
                          }`}>
                            <Wheat className={`w-8 h-8 ${i === 0 ? 'text-green-600' : 'text-gray-400'}`} />
                          </div>
                          <p className={`mt-2 text-sm font-medium ${i === 0 ? 'text-green-600' : 'text-gray-600'}`}>
                            {crop}
                          </p>
                          <p className="text-xs text-gray-400">Année {i + 1}</p>
                        </div>
                      ))}
                    </div>
                    <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-300 -z-10" style={{ width: 'calc(100% - 4rem)', marginLeft: '2rem' }}></div>
                  </div>
                </div>
              )}
            </div>

            {/* Caractéristiques du sol */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Beaker className="w-5 h-5 text-amber-600" />
                Caractéristiques du sol
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Type de sol</p>
                    <p className="font-medium">{data.soilType}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-2">pH du sol</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 relative">
                        <div className="h-2 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 rounded-full"></div>
                        <div 
                          className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white border-2 border-gray-800 rounded-full shadow"
                          style={{ left: `${(parseFloat(data.soilPH) / 14) * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-medium text-lg w-12">{data.soilPH}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>Acide</span>
                      <span>Neutre</span>
                      <span>Basique</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Matière organique</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-yellow-400 to-green-500 h-3 rounded-full"
                            style={{ width: `${Math.min(parseFloat(data.organicMatter) * 20, 100)}%` }}
                          />
                        </div>
                      </div>
                      <span className="font-medium">{data.organicMatter}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Qualité du sol</p>
                    <div className="flex items-center gap-2">
                      {['Faible', 'Moyen', 'Bon', 'Excellent'].map((level, i) => (
                        <div
                          key={i}
                          className={`h-8 flex-1 rounded ${
                            data.soilQuality === level 
                              ? 'bg-amber-500' 
                              : ['Faible', 'Moyen', 'Bon', 'Excellent'].indexOf(data.soilQuality) > i 
                                ? 'bg-amber-200' 
                                : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-center font-medium mt-1">{data.soilQuality}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Drainage</p>
                    <div className="flex items-center gap-2">
                      {['Faible', 'Moyen', 'Bon', 'Excellent'].map((level, i) => (
                        <div
                          key={i}
                          className={`h-8 flex-1 rounded ${
                            data.drainage === level 
                              ? 'bg-blue-500' 
                              : ['Faible', 'Moyen', 'Bon', 'Excellent'].indexOf(data.drainage) > i 
                                ? 'bg-blue-200' 
                                : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-center font-medium mt-1">{data.drainage}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Dernière analyse</p>
                    <p className="font-medium">{formatDate(data.lastSoilAnalysis)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Infrastructure et équipements */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Infrastructure et équipements
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Système d'irrigation</p>
                  <p className="font-medium">{data.irrigationSystem}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Capacité</p>
                  <p className="font-medium">{data.irrigationCapacity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Source d'eau</p>
                  <p className="font-medium">{data.waterSource}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Clôturé</p>
                  <p className="font-medium">{data.fencing ? 'Oui' : 'Non'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Stockage</p>
                  <p className="font-medium">{data.storage}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 mb-2">Accessibilité</p>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Truck
                          key={star}
                          className={`w-5 h-5 ${
                            star <= (data.accessibility === 'Excellente' ? 5 : 
                                   data.accessibility === 'Bonne' ? 4 : 
                                   data.accessibility === 'Moyenne' ? 3 : 
                                   data.accessibility === 'Difficile' ? 2 : 1)
                              ? 'text-blue-500 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium">{data.accessibility}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Historique et rendements */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Historique et rendements
              </h2>
              
              {/* Graphique des rendements */}
              {data.previousCrops && data.previousCrops.length > 0 && (
                <div className="mb-6">
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={data.previousCrops.map(item => ({
                      year: item.year,
                      rendement: parseFloat(item.yield),
                      crop: item.crop
                    }))}>
                      <defs>
                        <linearGradient id="colorRendement" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="year" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload[0]) {
                            return (
                              <div className="bg-white p-2 border rounded shadow-sm">
                                <p className="text-sm font-medium">{payload[0].payload.crop} - {payload[0].payload.year}</p>
                                <p className="text-sm text-purple-600">{payload[0].value} t/ha</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="rendement" 
                        stroke="#8b5cf6" 
                        fillOpacity={1} 
                        fill="url(#colorRendement)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="#8b5cf6"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${(parseFloat(data.averageYield) / 12) * 226} 226`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-lg font-bold">{data.averageYield}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Rendement moyen (t/ha)</p>
                </div>
                
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="#10b981"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${(parseFloat(data.expectedYield) / 12) * 226} 226`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-lg font-bold text-green-600">{data.expectedYield}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Rendement attendu (t/ha)</p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-500">Dernier labour</p>
                  <p className="font-medium mt-1">{formatDate(data.lastPlowing)}</p>
                </div>
              </div>
            </div>

            {/* Économie */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Euro className="w-5 h-5 text-green-600" />
                Prévisions économiques
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Coûts', value: parseFloat(data.productionCost), color: '#ef4444' },
                          { name: 'Marge', value: parseFloat(data.expectedRevenue) - parseFloat(data.productionCost), color: '#3b82f6' }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {[
                          { name: 'Coûts', value: parseFloat(data.productionCost), color: '#ef4444' },
                          { name: 'Marge', value: parseFloat(data.expectedRevenue) - parseFloat(data.productionCost), color: '#3b82f6' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value} €/ha`} />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  <div className="flex justify-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm">Coûts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Marge</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Coût de production</span>
                    <span className="text-xl font-bold text-red-600">{data.productionCost} €/ha</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Revenus attendus</span>
                    <span className="text-xl font-bold text-green-600">{data.expectedRevenue} €/ha</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Marge prévisionnelle</span>
                      <span className="text-xl font-bold text-blue-600">
                        {(parseFloat(data.expectedRevenue) - parseFloat(data.productionCost)).toFixed(0)} €/ha
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ 
                            width: `${((parseFloat(data.expectedRevenue) - parseFloat(data.productionCost)) / parseFloat(data.expectedRevenue) * 100).toFixed(0)}%` 
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Taux de marge: {((parseFloat(data.expectedRevenue) - parseFloat(data.productionCost)) / parseFloat(data.expectedRevenue) * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Caractéristiques physiques */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Mountain className="w-5 h-5 text-gray-600" />
                Caractéristiques physiques
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-500">Coordonnées GPS</span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded text-xs font-mono">
                    {data.coordinates.latitude}°, {data.coordinates.longitude}°
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Altitude</span>
                    <span className="text-sm font-medium">{data.altitude} m</span>
                  </div>
                  <div className="relative h-20 bg-gradient-to-t from-green-100 to-blue-100 rounded overflow-hidden">
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-green-600 opacity-50"
                      style={{ height: `${Math.min((parseFloat(data.altitude) / 1000) * 100, 100)}%` }}
                    ></div>
                    <Mountain className="absolute bottom-2 right-2 w-6 h-6 text-gray-700" />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Pente</span>
                    <span className="text-sm font-medium">{data.slope}%</span>
                  </div>
                  <div className="h-16 relative">
                    <svg viewBox="0 0 100 40" className="w-full h-full">
                      <path 
                        d={`M 0 40 L 100 ${40 - (parseFloat(data.slope) * 4)} L 100 40 Z`}
                        fill="#10b981"
                        opacity="0.3"
                      />
                      <line 
                        x1="0" 
                        y1="40" 
                        x2="100" 
                        y2={40 - (parseFloat(data.slope) * 4)}
                        stroke="#10b981"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Exposition</span>
                  </div>
                  <div className="flex justify-center">
                    <div className="relative w-24 h-24">
                      <Compass className="w-24 h-24 text-gray-300" />
                      <div className={`absolute inset-0 flex items-center justify-center`}>
                        <div 
                          className="w-2 h-12 bg-red-500 rounded-full origin-bottom"
                          style={{ 
                            transform: `rotate(${
                              data.exposition === 'Nord' ? 0 :
                              data.exposition === 'Nord-Est' ? 45 :
                              data.exposition === 'Est' ? 90 :
                              data.exposition === 'Sud-Est' ? 135 :
                              data.exposition === 'Sud' ? 180 :
                              data.exposition === 'Sud-Ouest' ? 225 :
                              data.exposition === 'Ouest' ? 270 :
                              data.exposition === 'Nord-Ouest' ? 315 : 0
                            }deg)`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-sm font-medium mt-2">{data.exposition}</p>
                </div>
              </div>
            </div>

            {/* Risques et contraintes */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Risques et contraintes
              </h2>
              <div className="space-y-3">
                {data.climateRisks && data.climateRisks.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Risques climatiques</p>
                    <div className="flex flex-wrap gap-1">
                      {data.climateRisks.map((risk, i) => (
                        <span key={i} className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">
                          {risk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {data.pestRisks && data.pestRisks.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Risques parasitaires</p>
                    <div className="flex flex-wrap gap-1">
                      {data.pestRisks.map((risk, i) => (
                        <span key={i} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                          {risk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {data.diseaseHistory && data.diseaseHistory.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Historique maladies</p>
                    <div className="flex flex-wrap gap-1">
                      {data.diseaseHistory.map((disease, i) => (
                        <span key={i} className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                          {disease}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Informations légales */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600" />
                Informations légales
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Type de propriété</p>
                  <p className="font-medium">{data.ownershipType}</p>
                </div>
                {data.lease && (
                  <div>
                    <p className="text-sm text-gray-500">Bail</p>
                    <p className="text-sm">{formatDate(data.lease.startDate)} - {formatDate(data.lease.endDate)}</p>
                    <p className="text-sm font-medium">{data.lease.cost}</p>
                  </div>
                )}
                {data.certifications && data.certifications.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Certifications</p>
                    <div className="flex flex-wrap gap-2">
                      {data.certifications.map((cert, i) => (
                        <span key={i} className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                          <Award className="w-3 h-3" />
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {data.subsidiesEligible && data.subsidiesEligible.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Aides éligibles</p>
                    <div className="space-y-1">
                      {data.subsidiesEligible.map((aid, i) => (
                        <p key={i} className="text-sm">• {aid}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Objectifs de durabilité */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-600" />
                Objectifs de durabilité
              </h2>
              
              {/* Graphique radial pour la durabilité */}
              <div className="mb-4">
                <ResponsiveContainer width="100%" height={180}>
                  <RadialBarChart 
                    cx="50%" 
                    cy="50%" 
                    innerRadius="20%" 
                    outerRadius="90%"
                    data={[
                      { name: 'Eau', value: parseFloat(data.sustainabilityGoals?.waterReduction || 0), fill: '#3b82f6' },
                      { name: 'Chimique', value: parseFloat(data.sustainabilityGoals?.chemicalReduction || 0), fill: '#10b981' },
                      { name: 'Biodiversité', value: parseFloat(data.sustainabilityGoals?.biodiversityIndex?.split('/')[0] || 0) * 10, fill: '#f59e0b' }
                    ]}
                  >
                    <RadialBar dataKey="value" cornerRadius={10} fill="#8884d8" />
                    <Tooltip formatter={(value) => `${value}%`} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Réduction eau</span>
                  </div>
                  <span className="text-sm font-medium">{data.sustainabilityGoals?.waterReduction}%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Réduction chimique</span>
                  </div>
                  <span className="text-sm font-medium">{data.sustainabilityGoals?.chemicalReduction}%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span className="text-sm">Biodiversité</span>
                  </div>
                  <span className="text-sm font-medium">{data.sustainabilityGoals?.biodiversityIndex}</span>
                </div>
                
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-500">Séquestration carbone</p>
                  <p className="text-sm font-medium flex items-center gap-1">
                    <Trees className="w-4 h-4 text-green-600" />
                    {data.sustainabilityGoals?.carbonSequestration}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes et photos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Notes */}
          {data.notes && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-600" />
                Notes
              </h2>
              <p className="text-gray-700">{data.notes}</p>
            </div>
          )}

          {/* Photos */}
          {data.photos && data.photos.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5 text-gray-600" />
                Photos
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {data.photos.map((photo, i) => (
                  <img 
                    key={i}
                    src={photo} 
                    alt={`Photo ${i + 1} du champ`}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Métadonnées */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Créé le {formatDate(data.createdDate)} • ID Agriculteur: {data.farmerId}</p>
        </div>
      </div>
    </main>
  );
};

export default FieldDetailsPage;