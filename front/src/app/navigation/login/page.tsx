'use client';

import React, { useState, useEffect } from 'react';
import {
  Globe,
  MapPin,
  Home,
  Users,
  ArrowRight,
  ArrowLeft,
  Check,
  Leaf,
  TreePine,
  ChevronDown,
  Lock,
} from 'lucide-react';
import { getLocationsPayload } from '../admin/pages/addLocation/api/locations'; // notre fonction GET /locations/payload
import { login } from '../../../../api/login';

type LocationsState = {
  countries: Array<{ id: string; name: string; code: string; flag?: string }>;
  regions: Record<string, Array<{ id: string; name: string }>>;
  communes: Record<string, Array<{ id: string; name: string }>>;
  villages: Record<string, Array<{ id: string; name: string }>>;
};

type FormData = {
  code: string;
  country: string | null;
  region: string | null;
  commune: string | null;
  village: string | null;
};

export default function FarmerLogin() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState('');
  const [locationData, setLocationData] = useState<LocationsState>({
    countries: [],
    regions: {},
    communes: {},
    villages: {},
  });
  const [formData, setFormData] = useState<FormData>({
    code: '',
    country: null,
    region: null,
    commune: null,
    village: null,
  });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const payload = await getLocationsPayload();
        setLocationData(payload);
        setError(null);
      } catch (e: any) {
        setError(e?.message || 'Erreur de chargement.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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

  function handleSelect(
    level: 'country' | 'region' | 'commune' | 'village',
    id: string
  ) {
    setFormData((prev) => {
      if (level === 'country') {
        return { country: id, region: null, commune: null, village: null };
      }
      if (level === 'region') {
        return { ...prev, region: id, commune: null, village: null };
      }
      if (level === 'commune') {
        return { ...prev, commune: id, village: null };
      }
      return { ...prev, village: id };
    });

    // Option: avancer automatiquement d’une étape
    setStep((prev) => {
      if (level === 'country') return 2;
      if (level === 'region') return 3;
      if (level === 'commune') return 4;
      return prev;
    });
  }

  // case 2
  const regions = formData.country
    ? locationData.regions[formData.country] || []
    : [];
  // case 3
  const communes = formData.region
    ? locationData.communes[formData.region] || []
    : [];
  // case 4
  const villages = formData.commune
    ? locationData.villages[formData.commune] || []
    : [];

  function findCountryName(id: string | null, data: typeof locationData) {
    if (!id) return '';
    return data.countries.find((c) => c.id === id)?.name || '';
  }

  function findRegionName(
    countryId: string | null,
    regionId: string | null,
    data: typeof locationData
  ) {
    if (!countryId || !regionId) return '';
    return data.regions[countryId]?.find((r) => r.id === regionId)?.name || '';
  }

  function findCommuneName(
    regionId: string | null,
    communeId: string | null,
    data: typeof locationData
  ) {
    if (!regionId || !communeId) return '';
    return data.communes[regionId]?.find((c) => c.id === communeId)?.name || '';
  }

  function findVillageName(
    communeId: string | null,
    villageId: string | null,
    data: typeof locationData
  ) {
    if (!communeId || !villageId) return '';
    return (
      data.villages[communeId]?.find((v) => v.id === villageId)?.name || ''
    );
  }

  async function handleSubmit() {
    setErrorMsg(null);

    // 1) Validation locale
    if (!canSubmit) {
      setErrorMsg(
        'Veuillez compléter votre localisation et saisir un code valide (8 caractères).'
      );
      return;
    }

    // 2) Normaliser le code (ex: enlever tirets + uppercase si tu veux)
    const rawCode = (formData.code ?? '').toString(); // évite null
    // const normalized = rawCode.replace(/-/g, '').toUpperCase();

    // 3) Payload propre
    const payload = {
      code: rawCode, // ou normalized
      country: formData.country!,
      region: formData.region!,
      commune: formData.commune!,
      village: formData.village!,
    };

    setSubmitting(true);
    try {
      const data = await login(payload);

      // Optionnel: token
      // if (data.token) localStorage.setItem('token', data.token);

      // Redirection
      window.location.href = `/navigation/dashboard/${data.id}`;
      // ou Next.js:
      // router.push(`/navigation/dashboard/${data.id}`);
    } catch (err: any) {
      // http.ts doit déjà throw avec le message serveur si dispo
      setErrorMsg(err?.message || 'Erreur réseau.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  const isStepComplete = (step) => {
    switch (step) {
      case 1:
        return !!formData.country;
      case 2:
        return !!formData.region;
      case 3:
        return !!formData.commune;
      case 4:
        return !!formData.village;
      case 5:
        return (formData.code?.length || 0) === 8;
      default:
        return false;
    }
  };

  function handleCodeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setFormData((prev) => ({ ...prev, code: raw }));
  }

  function handleCodePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const text = e.clipboardData.getData('text');
    const raw = text;
    setFormData((prev) => ({ ...prev, code: raw }));
  }

  // 8 alphanum, majuscules
  const sanitizeCode = (v: string) =>
    v
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 8);

  // insère un tiret après 4 chars → XXXX-XXXX
  const formatCode = (raw: string) =>
    raw.length > 4 ? `${raw.slice(0, 4)}-${raw.slice(4)}` : raw;

  const isCodeValid = (raw: string) => /^[A-Z0-9]{8}$/.test(raw);

  const canSubmit =
    (!!formData.country &&
      !!formData.region &&
      !!formData.commune &&
      !!formData.village &&
      formData.code) ||
    '';

  if (loading) return <div className="p-6 text-gray-500">Chargement…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Sélectionnez votre pays
            </h3>
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
                  <span className="text-xl font-medium text-gray-800">
                    {country.name}
                  </span>
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
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Sélectionnez votre région
            </h3>
            <div className="grid gap-3">
              {regions?.map((region) => (
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
                  <span className="text-lg font-medium text-gray-800">
                    {region.name}
                  </span>
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
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Sélectionnez votre commune
            </h3>
            <div className="grid gap-3">
              {communes?.map((commune) => (
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
                  <span className="text-lg font-medium text-gray-800">
                    {commune.name}
                  </span>
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
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Sélectionnez votre village
            </h3>
            <div className="grid gap-3">
              {villages?.map((village) => (
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
                  <span className="text-lg font-medium text-gray-800">
                    {village.name}
                  </span>
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
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Entrez votre code d'accès
            </h3>
            <p className="text-gray-600 mb-6">
              Saisissez le code à 8 caractères fourni par votre coopérative
            </p>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="text"
                value={formatCode(formData.code || '')} // ← affichage formaté
                onChange={handleCodeChange}
                onPaste={handleCodePaste}
                placeholder="XXXX-XXXX"
                inputMode="latin" // ou "text" ; si numérique: "numeric"
                className="w-full pl-12 pr-4 py-6 text-2xl font-mono text-center border-2 border-gray-300 rounded-2xl focus:border-blue-600 focus:outline-none transition-colors tracking-widest"
                maxLength={9} // 8 + le tiret affiché
              />
            </div>

            <div className="flex items-center justify-center gap-2 mt-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i < (formData.code?.length || 0)
                      ? 'bg-blue-600'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Résumé de la sélection */}
            <div className="bg-gray-50 rounded-2xl p-6 mt-8">
              <h4 className="font-semibold text-gray-700 mb-3">
                Votre localisation :
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Pays :</span>
                  <span className="font-medium">
                    {
                      locationData.countries.find(
                        (c) => c.id === formData.country
                      )?.name
                    }
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Région :</span>
                  <span className="font-medium">
                    {
                      locationData.regions[formData.country]?.find(
                        (r) => r.id === formData.region
                      )?.name
                    }
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Commune :</span>
                  <span className="font-medium">
                    {
                      locationData.communes[formData.region]?.find(
                        (c) => c.id === formData.commune
                      )?.name
                    }
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Village :</span>
                  <span className="font-medium">
                    {
                      locationData.villages[formData.commune]?.find(
                        (v) => v.id === formData.village
                      )?.name
                    }
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
            <span className="text-lg font-semibold text-gray-800">
              Pangée Internationale
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Espace Agriculteurs
          </h1>
          <p className="text-gray-600">
            Connectez-vous pour accéder à votre coopérative
          </p>
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
            <>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || submitting}
                className="px-6 py-3 rounded-2xl bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Connexion...' : 'Valider'}
              </button>

              {errorMsg && (
                <p className="mt-2 text-sm text-red-600">{errorMsg}</p>
              )}
            </>
          )}
        </div>

        {/* Help text */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Vous n'avez pas de code ?
            <a
              href="#"
              className="text-blue-600 font-medium hover:underline ml-1"
            >
              Contactez votre coopérative
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
