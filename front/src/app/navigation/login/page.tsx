"use client"

import React, { useState } from 'react';
import { Globe, MapPin, Home, Users, ArrowRight, ArrowLeft, Check, Leaf, TreePine, ChevronDown, Lock } from 'lucide-react';

export default function FarmerLogin() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    country: '',
    region: '',
    commune: '',
    village: '',
    code: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState('');

  // Données simulées - à remplacer par une API
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

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      setShowDropdown('');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setShowDropdown('');
    }
  };

  const handleSelect = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setShowDropdown('');
    
    // Auto-advance pour les étapes de sélection
    if (currentStep < 4) {
      setTimeout(() => handleNext(), 300);
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length <= 8) {
      setFormData({ ...formData, code: value });
    }
  };

  const handleSubmit = async () => {
    try{
      const response = await fetch("http://localhost:3005/login", {
        method: "POST", 
        headers : {
          "Content-Type" : "application/json",
        },
        body: JSON.stringify(formData)
      })
      if(response.ok) {
        const data = await response.json()
        console.log(data)
        window.location.href = `/navigation/dashboard/${data.id}`
      } else{
        console.error("Une erreur a été détecté !")
      }
    }catch(err) {
      console.error("Une erreur a été détecté : ", err)
    }
  };

  const isStepComplete = (step) => {
    switch(step) {
      case 1: return !!formData.country;
      case 2: return !!formData.region;
      case 3: return !!formData.commune;
      case 4: return !!formData.village;
      case 5: return formData.code.length === 8;
      default: return false;
    }
  };

  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Sélectionnez votre pays</h3>
            <div className="grid gap-3">
              {locationData.countries.map((country) => (
                <button
                  key={country.id}
                  onClick={() => handleSelect('country', country.id)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 flex items-center gap-4 hover:shadow-lg ${
                    formData.country === country.id 
                      ? 'border-blue-600 bg-blue-50 shadow-md' 
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <span className="text-4xl">{country.flag}</span>
                  <span className="text-xl font-medium text-gray-800">{country.name}</span>
                  {formData.country === country.id && (
                    <Check className="w-6 h-6 text-blue-600 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Sélectionnez votre région</h3>
            <div className="grid gap-3">
              {locationData.regions[formData.country]?.map((region) => (
                <button
                  key={region.id}
                  onClick={() => handleSelect('region', region.id)}
                  className={`p-5 rounded-2xl border-2 transition-all duration-300 flex items-center gap-4 hover:shadow-lg ${
                    formData.region === region.id 
                      ? 'border-green-600 bg-green-50 shadow-md' 
                      : 'border-gray-200 bg-white hover:border-green-300'
                  }`}
                >
                  <MapPin className="w-6 h-6 text-green-600" />
                  <span className="text-lg font-medium text-gray-800">{region.name}</span>
                  {formData.region === region.id && (
                    <Check className="w-5 h-5 text-green-600 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Sélectionnez votre commune</h3>
            <div className="grid gap-3">
              {locationData.communes[formData.region]?.map((commune) => (
                <button
                  key={commune.id}
                  onClick={() => handleSelect('commune', commune.id)}
                  className={`p-5 rounded-2xl border-2 transition-all duration-300 flex items-center gap-4 hover:shadow-lg ${
                    formData.commune === commune.id 
                      ? 'border-blue-600 bg-blue-50 shadow-md' 
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <Home className="w-6 h-6 text-blue-600" />
                  <span className="text-lg font-medium text-gray-800">{commune.name}</span>
                  {formData.commune === commune.id && (
                    <Check className="w-5 h-5 text-blue-600 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Sélectionnez votre village</h3>
            <div className="grid gap-3">
              {locationData.villages[formData.commune]?.map((village) => (
                <button
                  key={village.id}
                  onClick={() => handleSelect('village', village.id)}
                  className={`p-5 rounded-2xl border-2 transition-all duration-300 flex items-center gap-4 hover:shadow-lg ${
                    formData.village === village.id 
                      ? 'border-green-600 bg-green-50 shadow-md' 
                      : 'border-gray-200 bg-white hover:border-green-300'
                  }`}
                >
                  <Users className="w-6 h-6 text-green-600" />
                  <span className="text-lg font-medium text-gray-800">{village.name}</span>
                  {formData.village === village.id && (
                    <Check className="w-5 h-5 text-green-600 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Entrez votre code d'accès</h3>
            <p className="text-gray-600 mb-6">
              Saisissez le code à 8 caractères fourni par votre coopérative
            </p>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="text"
                value={formData.code}
                onChange={handleCodeChange}
                placeholder="XXXX-XXXX"
                className="w-full pl-12 pr-4 py-6 text-2xl font-mono text-center border-2 border-gray-300 rounded-2xl focus:border-blue-600 focus:outline-none transition-colors tracking-widest"
                maxLength="8"
              />
            </div>
            
            <div className="flex items-center justify-center gap-2 mt-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i < formData.code.length ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Résumé de la sélection */}
            <div className="bg-gray-50 rounded-2xl p-6 mt-8">
              <h4 className="font-semibold text-gray-700 mb-3">Votre localisation :</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Pays :</span>
                  <span className="font-medium">
                    {locationData.countries.find(c => c.id === formData.country)?.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Région :</span>
                  <span className="font-medium">
                    {locationData.regions[formData.country]?.find(r => r.id === formData.region)?.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Commune :</span>
                  <span className="font-medium">
                    {locationData.communes[formData.region]?.find(c => c.id === formData.commune)?.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Village :</span>
                  <span className="font-medium">
                    {locationData.villages[formData.commune]?.find(v => v.id === formData.village)?.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      {/* Décoration de fond */}

      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg mb-6">
            <TreePine className="w-6 h-6 text-green-600" />
            <span className="text-lg font-semibold text-gray-800">Pangée Internationale</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Espace Agriculteurs
          </h1>
          <p className="text-gray-600">Connectez-vous pour accéder à votre coopérative</p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`flex items-center ${step < 5 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    currentStep > step 
                      ? 'bg-green-600 text-white' 
                      : currentStep === step 
                      ? 'bg-blue-600 text-white shadow-lg scale-110' 
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {currentStep > step ? <Check className="w-5 h-5" /> : step}
                </div>
                {step < 5 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded transition-all duration-500 ${
                      currentStep > step ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-2">
            <span>Pays</span>
            <span>Région</span>
            <span>Commune</span>
            <span>Village</span>
            <span>Code</span>
          </div>
        </div>

        {/* Main content */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
          {renderStepContent()}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between gap-4">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              currentStep === 1 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-lg'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>

          {currentStep < 5 ? (
            <button
              onClick={handleNext}
              disabled={!isStepComplete(currentStep)}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all ${
                isStepComplete(currentStep)
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Suivant
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!isStepComplete(5) || isLoading}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all ${
                isStepComplete(5) && !isLoading
                  ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:shadow-lg shadow-lg' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connexion...
                </>
              ) : (
                <>
                  Se connecter
                  <Check className="w-5 h-5" />
                </>
              )}
            </button>
          )}
        </div>

        {/* Help text */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Vous n'avez pas de code ? 
            <a href="#" className="text-blue-600 font-medium hover:underline ml-1">
              Contactez votre coopérative
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}