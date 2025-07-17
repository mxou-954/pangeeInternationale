"use client"

import React, { useState, useEffect } from 'react';
import { Leaf, Users, Heart, Globe, ArrowRight, Sparkles, TreePine, Droplets, Sun, MapPin, Calendar, Target, ChevronDown, Check, TrendingUp, HandHeart, Building } from 'lucide-react';

export default function PangeeHomepage() {
  const [selectedProject, setSelectedProject] = useState(0);
  const [selectedYear, setSelectedYear] = useState('2024');
  const [impactCalculator, setImpactCalculator] = useState({ donation: 50, impact: 2 });
  const [activeTab, setActiveTab] = useState('agriculture');

  const projects = [
    {
      id: 0,
      name: "Coopérative de Mbour",
      region: "Thiès, Sénégal",
      type: "Agriculture",
      beneficiaires: 234,
      image: "🌾",
      description: "Culture de mil et arachide, formation aux techniques durables"
    },
    {
      id: 1,
      name: "Jardins Urbains de Dakar",
      region: "Dakar, Sénégal",
      type: "Écologie Urbaine",
      beneficiaires: 156,
      image: "🌱",
      description: "Potagers communautaires et compostage en milieu urbain"
    },
    {
      id: 2,
      name: "Centre de Santé Communautaire",
      region: "Casamance, Sénégal",
      type: "Santé",
      beneficiaires: 450,
      image: "🏥",
      description: "Soins de base et sensibilisation sanitaire"
    }
  ];

  const timeline = {
    '2019': { villages: 2, cooperatives: 1, beneficiaires: 50 },
    '2020': { villages: 4, cooperatives: 2, beneficiaires: 150 },
    '2021': { villages: 6, cooperatives: 3, beneficiaires: 320 },
    '2022': { villages: 8, cooperatives: 5, beneficiaires: 540 },
    '2023': { villages: 10, cooperatives: 6, beneficiaires: 720 },
    '2024': { villages: 12, cooperatives: 8, beneficiaires: 850 }
  };

  const handleDonationChange = (value) => {
    setImpactCalculator({
      donation: value,
      impact: Math.floor(value / 25) // 25€ = 1 famille aidée
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-green-50">
      {/* Hero Section avec CTA clair */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background décoratif statique */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-30"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-200 rounded-full filter blur-3xl opacity-30"></div>
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Contenu textuel */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full mb-6">
                <Globe className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Solidarité Internationale</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="text-blue-900">Pangée</span>
                <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent block">
                  Internationale
                </span>
              </h1>
              
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Nous construisons un avenir durable pour l'Afrique à travers le 
                <span className="font-semibold text-blue-600"> développement participatif</span> des 
                communautés locales.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium shadow-lg">
                  Découvrir nos projets
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 font-medium">
                  <Heart className="w-5 h-5 text-red-500" />
                  Faire un don
                </button>
              </div>
            </div>

            {/* Visuel Hero */}
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-100 rounded-2xl p-6 text-center">
                    <TreePine className="w-12 h-12 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-800">850+</div>
                    <div className="text-sm text-gray-600">Familles aidées</div>
                  </div>
                  <div className="bg-blue-100 rounded-2xl p-6 text-center">
                    <Users className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-800">12</div>
                    <div className="text-sm text-gray-600">Villages impactés</div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-6 text-white text-center">
                  <div className="text-3xl font-bold mb-2">8</div>
                  <div>Coopératives actives</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Carte Interactive des Projets */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Nos projets sur le terrain
            </span>
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Explorez nos différentes initiatives à travers le Sénégal
          </p>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Carte simplifiée */}
            <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-3xl p-8 relative h-96">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl opacity-20">🌍</div>
              </div>
              {projects.map((project, idx) => (
                <button
                  key={project.id}
                  onClick={() => setSelectedProject(idx)}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                    selectedProject === idx ? 'scale-125' : 'scale-100'
                  } transition-all duration-300`}
                  style={{
                    top: `${30 + idx * 20}%`,
                    left: `${40 + idx * 15}%`
                  }}
                >
                  <div className={`relative ${
                    selectedProject === idx ? 'animate-pulse' : ''
                  }`}>
                    <MapPin className={`w-8 h-8 ${
                      selectedProject === idx ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                    {selectedProject === idx && (
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-600 rounded-full animate-ping"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Détails du projet sélectionné */}
            <div className="bg-gray-50 rounded-3xl p-8">
              <div className="text-4xl mb-4">{projects[selectedProject].image}</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {projects[selectedProject].name}
              </h3>
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin className="w-4 h-4" />
                <span>{projects[selectedProject].region}</span>
              </div>
              <p className="text-gray-700 mb-6">
                {projects[selectedProject].description}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-1">Type</div>
                  <div className="font-semibold text-blue-600">{projects[selectedProject].type}</div>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-1">Bénéficiaires</div>
                  <div className="font-semibold text-green-600">{projects[selectedProject].beneficiaires}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Interactive */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Notre évolution depuis 2019
          </h2>

          <div className="max-w-4xl mx-auto">
            {/* Sélecteur d'année */}
            <div className="flex justify-center gap-2 mb-12 flex-wrap">
              {Object.keys(timeline).map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-6 py-3 rounded-full font-medium transition-all ${
                    selectedYear === year
                      ? 'bg-blue-600 text-white shadow-lg scale-110'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>

            {/* Statistiques de l'année sélectionnée */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-xl text-center transform hover:scale-105 transition-transform">
                <Building className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  {timeline[selectedYear].villages}
                </div>
                <div className="text-gray-600">Villages</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-xl text-center transform hover:scale-105 transition-transform">
                <HandHeart className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  {timeline[selectedYear].cooperatives}
                </div>
                <div className="text-gray-600">Coopératives</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-xl text-center transform hover:scale-105 transition-transform">
                <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  {timeline[selectedYear].beneficiaires}
                </div>
                <div className="text-gray-600">Bénéficiaires</div>
              </div>
            </div>

            {/* Graphique de progression */}
            <div className="mt-8 bg-white rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-gray-700">Croissance continue</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-green-600 transition-all duration-1000"
                  style={{ width: `${((parseInt(selectedYear) - 2019) / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Domaines avec Tabs */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Nos domaines d'expertise
          </h2>

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-12 flex-wrap">
            {[
              { id: 'agriculture', label: 'Agriculture', icon: Leaf },
              { id: 'ecologie', label: 'Écologie Urbaine', icon: Globe },
              { id: 'sante', label: 'Santé', icon: Heart },
              { id: 'education', label: 'Éducation', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Contenu des tabs */}
          <div className="max-w-4xl mx-auto">
            {activeTab === 'agriculture' && (
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Agriculture Durable</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 mt-0.5" />
                        <span className="text-gray-700">Formation aux techniques agricoles durables</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 mt-0.5" />
                        <span className="text-gray-700">Mise en place de coopératives agricoles</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 mt-0.5" />
                        <span className="text-gray-700">Recensement et suivi des cultures</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 mt-0.5" />
                        <span className="text-gray-700">Distribution de semences adaptées</span>
                      </li>
                    </ul>
                  </div>
                  <div className="text-center">
                    <div className="text-8xl mb-4">🌾</div>
                    <div className="bg-white rounded-2xl p-4 shadow-lg">
                      <div className="text-3xl font-bold text-green-600">3000+</div>
                      <div className="text-gray-600">hectares cultivés</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ecologie' && (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Écologie Urbaine</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-blue-600 mt-0.5" />
                        <span className="text-gray-700">Création de jardins urbains communautaires</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-blue-600 mt-0.5" />
                        <span className="text-gray-700">Gestion durable des déchets</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-blue-600 mt-0.5" />
                        <span className="text-gray-700">Sensibilisation environnementale</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-blue-600 mt-0.5" />
                        <span className="text-gray-700">Projets de compostage collectif</span>
                      </li>
                    </ul>
                  </div>
                  <div className="text-center">
                    <div className="text-8xl mb-4">🌱</div>
                    <div className="bg-white rounded-2xl p-4 shadow-lg">
                      <div className="text-3xl font-bold text-blue-600">5</div>
                      <div className="text-gray-600">projets urbains actifs</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sante' && (
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-3xl p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Santé Communautaire</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-red-600 mt-0.5" />
                        <span className="text-gray-700">Création de centres de santé communautaires</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-red-600 mt-0.5" />
                        <span className="text-gray-700">Campagnes de vaccination</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-red-600 mt-0.5" />
                        <span className="text-gray-700">Formation d'agents de santé locaux</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-red-600 mt-0.5" />
                        <span className="text-gray-700">Sensibilisation à l'hygiène</span>
                      </li>
                    </ul>
                  </div>
                  <div className="text-center">
                    <div className="text-8xl mb-4">🏥</div>
                    <div className="bg-white rounded-2xl p-4 shadow-lg">
                      <div className="text-3xl font-bold text-red-600">2</div>
                      <div className="text-gray-600">centres de santé créés</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'education' && (
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Éducation & Formation</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-purple-600 mt-0.5" />
                        <span className="text-gray-700">Alphabétisation des adultes</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-purple-600 mt-0.5" />
                        <span className="text-gray-700">Formation professionnelle</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-purple-600 mt-0.5" />
                        <span className="text-gray-700">Bourses scolaires</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-purple-600 mt-0.5" />
                        <span className="text-gray-700">Ateliers d'entrepreneuriat</span>
                      </li>
                    </ul>
                  </div>
                  <div className="text-center">
                    <div className="text-8xl mb-4">📚</div>
                    <div className="bg-white rounded-2xl p-4 shadow-lg">
                      <div className="text-3xl font-bold text-purple-600">400+</div>
                      <div className="text-gray-600">personnes formées</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Calculateur d'Impact */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Votre impact potentiel
          </h2>

          <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <label className="text-lg font-medium text-gray-700 mb-4 block">
                Avec un don de
              </label>
              <div className="flex items-center justify-center gap-4">
                <input
                  type="range"
                  min="10"
                  max="500"
                  value={impactCalculator.donation}
                  onChange={(e) => handleDonationChange(e.target.value)}
                  className="w-64"
                />
                <div className="text-3xl font-bold text-blue-600 min-w-[100px]">
                  {impactCalculator.donation}€
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 text-center">
              <div className="text-lg text-gray-700 mb-2">Vous pouvez aider</div>
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
                {impactCalculator.impact}
              </div>
              <div className="text-lg text-gray-700">
                {impactCalculator.impact === 1 ? 'famille' : 'familles'} pendant 1 mois
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl mb-1">🌾</div>
                <div className="text-sm text-gray-600">Semences</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">🛠️</div>
                <div className="text-sm text-gray-600">Outils</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">📚</div>
                <div className="text-sm text-gray-600">Formation</div>
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 rounded-xl font-medium text-lg hover:shadow-lg transition-all mt-6">
              Faire un don de {impactCalculator.donation}€
            </button>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ensemble, bâtissons l'avenir
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
            Rejoignez-nous dans cette aventure humaine pour un développement 
            durable et participatif de l'Afrique.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-10 py-5 rounded-lg font-bold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
              <span className="flex items-center gap-3 justify-center">
                Devenir bénévole
                <ArrowRight className="w-5 h-5" />
              </span>
            </button>
            
            <button className="bg-transparent border-2 border-white text-white px-10 py-5 rounded-lg font-bold hover:bg-white hover:text-blue-600 transition-all">
              <span className="flex items-center gap-3 justify-center">
                <Heart className="w-5 h-5" />
                Soutenir nos actions
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}