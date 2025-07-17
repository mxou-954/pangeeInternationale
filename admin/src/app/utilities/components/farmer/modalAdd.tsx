import React from 'react'
import { X, Users, Phone, Mail, MapPin, CircleQuestionMark, Key } from "lucide-react"; // ou tes icônes

type Props = {
  newFarmer: any; // idéalement tu types ça mieux
  setNewFarmer: React.Dispatch<React.SetStateAction<any>>;
  setShowAddForm: React.Dispatch<React.SetStateAction<boolean>>;
  locationData: any;
  handleNewFarmer: () => void;
  isEditMode: Boolean;
};

export default function ModalAdd({
  newFarmer,
  setNewFarmer,
  setShowAddForm,
  locationData,
  handleNewFarmer,
  isEditMode,
}: Props) {

  return (
    <div className="fixed inset-0 bg-opacity-100 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            {/* Header de la modal */}
            <div className="bg-gradient-to-r from-blue-600 to-green-600 p-6">
              <div className="flex items-center justify-between">
                {isEditMode ? (
                    <div>
                    <h2 className="text-2xl font-bold text-white">
                      Modifier l'agriculteur
                    </h2>
                    <p className="text-blue-100 mt-1">
                    Modifiez les informations pour changer les données
                    </p>
                  </div>
                ): (
                  <div>
                  <h2 className="text-2xl font-bold text-white">
                    Nouvel agriculteur
                  </h2>
                  <p className="text-blue-100 mt-1">
                    Remplissez les informations pour créer un compte
                  </p>
                </div>  
                )}
                
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-2 hover:bg-white hover:text-gray-800 hover:bg-opacity-20 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Contenu de la modal */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Informations personnelles */}
                <div className="col-span-2">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    Informations personnelles
                  </h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={newFarmer.firstName}
                    onChange={(e) =>
                      setNewFarmer({ ...newFarmer, firstName: e.target.value })
                    }
                    className="w-full text-gray-700  px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
                    placeholder="Ex: Mamadou"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={newFarmer.lastName}
                    onChange={(e) =>
                      setNewFarmer({ ...newFarmer, lastName: e.target.value })
                    }
                    className="w-full text-gray-700  px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
                    placeholder="Ex: Diallo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="tel"
                      value={newFarmer.phone}
                      onChange={(e) =>
                        setNewFarmer({ ...newFarmer, phone: e.target.value })
                      }
                      className="w-full text-gray-700  pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
                      placeholder="+221 77 123 45 67"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      value={newFarmer.email}
                      onChange={(e) =>
                        setNewFarmer({ ...newFarmer, email: e.target.value })
                      }
                      className="w-full text-gray-700 pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
                      placeholder="exemple@email.com"
                    />
                  </div>
                </div>

                {/* Localisation */}
                <div className="col-span-2 mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-green-600" />
                    </div>
                    Localisation
                  </h3>
                </div>

                <div>
                  <div className="flex">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pays
                  </label>
                  <a href="/utilities/pages/addLocation">
                    <CircleQuestionMark className="ml-1 w-4 h-4 items-center text-blue-500"/>
                  </a>
                  </div>
                  <select
                    value={newFarmer.country}
                    onChange={(e) =>
                      setNewFarmer({
                        ...newFarmer,
                        country: e.target.value,
                        region: "",
                        commune: "",
                        village: "",
                      })
                    }
                    className="w-full text-gray-700  px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
                  >
                    <option value="">Sélectionner un pays...</option>
                    {locationData.countries.map((country) => (
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
                    value={newFarmer.region}
                    onChange={(e) =>
                      setNewFarmer({
                        ...newFarmer,
                        region: e.target.value,
                        commune: "",
                        village: "",
                      })
                    }
                    className="w-full px-4 py-3 text-gray-700  bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition-all disabled:opacity-50"
                    disabled={!newFarmer.country}
                  >
                    <option value="">Sélectionner une région...</option>
                    {locationData.regions[newFarmer.country as keyof typeof locationData.regions]?.map((region) => (
  <option key={region.id} value={region.id}>
    {region.name}
  </option>
))}

                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commune
                  </label>
                  <select
                    value={newFarmer.commune}
                    onChange={(e) =>
                      setNewFarmer({
                        ...newFarmer,
                        commune: e.target.value,
                        village: "",
                      })
                    }
                    className="w-full text-gray-700 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition-all disabled:opacity-50"
                    disabled={!newFarmer.region}
                  >
                    <option value="">Sélectionner une commune...</option>
                    {locationData.communes[newFarmer.region]?.map((commune) => (
                      <option key={commune.id} value={commune.id}>
                        {commune.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Village
                  </label>
                  <select
                    value={newFarmer.village}
                    onChange={(e) =>
                      setNewFarmer({ ...newFarmer, village: e.target.value })
                    }
                    className="w-full text-gray-700 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition-all disabled:opacity-50"
                    disabled={!newFarmer.commune}
                  >
                    <option value="">Sélectionner un village...</option>
                    {locationData.villages[newFarmer.commune]?.map(
                      (village) => (
                        <option key={village.id} value={village.id}>
                          {village.name}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              {/* Info sur le code */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                    <Key className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      Code d'accès sécurisé
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Un code unique à 8 caractères sera généré automatiquement
                      pour cet agriculteur. Il pourra l'utiliser pour se
                      connecter à son espace personnel.
                    </p>
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
              {isEditMode ? (
              <button
              onClick={handleNewFarmer}
              disabled={
                !newFarmer.firstName ||
                !newFarmer.lastName ||
                !newFarmer.phone ||
                !newFarmer.village
              }
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                newFarmer.firstName &&
                newFarmer.lastName &&
                newFarmer.phone &&
                newFarmer.village
                  ? "bg-gradient-to-r from-blue-600 to-green-600 text-white hover:shadow-lg transform hover:scale-105"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Modifier l'agriculteur
            </button>
              ):(
                <button
                onClick={handleNewFarmer}
                disabled={
                  !newFarmer.firstName ||
                  !newFarmer.lastName ||
                  !newFarmer.phone ||
                  !newFarmer.village
                }
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  newFarmer.firstName &&
                  newFarmer.lastName &&
                  newFarmer.phone &&
                  newFarmer.village
                    ? "bg-gradient-to-r from-blue-600 to-green-600 text-white hover:shadow-lg transform hover:scale-105"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Créer l'agriculteur
              </button>
              )}
            </div>
          </div>
        </div>
  )
}
