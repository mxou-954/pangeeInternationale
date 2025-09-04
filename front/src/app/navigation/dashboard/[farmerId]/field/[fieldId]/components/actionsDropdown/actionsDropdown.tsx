'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Sprout,
  Calendar,
  Tractor,
  BarChart3,
  MapPin,
  Settings,
  X,
  CheckCircle,
  Save,
  Users,
  Warehouse,
  Droplet,
  Droplets,
  HelpCircle,
  Leaf,
  Beaker,
  FileText,
} from 'lucide-react';

import AddMemberModal from '../addMembers/addMembers';
import AgriculturalDashboard from '../addStocks/addStocks';
import EquipmentAddModal from '../addEquipement/addEquipement';
import AgriculturalActivityModal from '../addActivities/addActivities';
import { getZonesByField } from '../../../../../../../../../api/zones';
import {
  createHarvest,
  updateHarvest,
} from '../../../../../../../../../api/harvests';

type Props = {
  farmerId: string;
  fieldId: string;
  editingHarvest?: any;
  onEditComplete?: (v: any) => void;
  onSubmit?: (harvest: any) => void; // EXISTANT (récoltes)
  onMemberSaved?: (member: any) => void; // <— NOUVEAU (membres)
};

export default function ActionsDropdown({
  farmerId,
  fieldId,
  editingHarvest,
  onEditComplete,
  onSubmit,
  onMemberSaved = () => {},
  onAddMember,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [showHarvestModal, setShowHarvestModal] = useState(false);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [showAddStocks, setShowAddStocks] = useState(false);
  const [showAddEquipements, setShowAddEquipements] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [zones, setZones] = useState([]);
  const dropdownRef = useRef(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isHarvested, setIsHarvested] = useState(isEditMode ? true : false);
  const hydratedRef = useRef(false); // empêche une réhydratation multiple

  // État du formulaire de récolte
  const [harvestForm, setHarvestForm] = useState({
    cropType: '',
    plantingDate: '',
    variety: '',
    zone: '',
    harvestDate: '',
    pesticidesUsed: '',
    problemsEncountered: '',
    yieldTonnes: '',
    harvestQuality: '',
    notes: '',
  });

  useEffect(() => {
    if (!editingHarvest) return;
    setIsEditMode(true);
    setShowHarvestModal(true);
    hydratedRef.current = false; // prêt pour nouvelle hydratation
  }, [editingHarvest]);

  const closeModal = () => {
    setShowHarvestModal(false);
    hydratedRef.current = false;
    onEditComplete?.(null); // parent -> setEditingHarvest(null)
  };

  // 👉 Hydratation: UNE FOIS par ouverture
  useEffect(() => {
    if (!showHarvestModal || !editingHarvest) return;
    if (hydratedRef.current) return;

    const zId =
      editingHarvest?.zone?.id ??
      editingHarvest?.zoneId ??
      editingHarvest?.zoneIdSnapshot ??
      null;

    setHarvestForm({
      cropType: editingHarvest.cropType || '',
      plantingDate: editingHarvest.plantingDate || '',
      variety: editingHarvest.variety || '',
      harvestDate: editingHarvest.harvestDate || '',
      pesticidesUsed: editingHarvest.pesticidesUsed || '',
      problemsEncountered: editingHarvest.problemsEncountered || '',
      yieldTonnes:
        editingHarvest.yieldTonnes != null
          ? String(editingHarvest.yieldTonnes)
          : '',
      harvestQuality: editingHarvest.harvestQuality || '',
      notes: editingHarvest.notes || '',
      zone: zId ? String(zId) : '',
    });

    hydratedRef.current = true;
  }, [showHarvestModal, editingHarvest]);

  // 👉 Chargement des zones à l’ouverture, et validation de la valeur sélectionnée
  useEffect(() => {
    if (!showHarvestModal) return;
    const fid = editingHarvest?.field?.id || fieldId;
    if (!fid) return;

    const ac = new AbortController();

    (async () => {
      try {
        const data: any[] = await getZonesByField(String(fid), {
          signal: ac.signal,
        });
        const list = Array.isArray(data) ? data : [];
        if (ac.signal.aborted) return;

        setZones(list);

        // 🔒 NE RIEN MODIFIER si une valeur est déjà là
        setHarvestForm((f: any) => {
          const current = f.zone ?? '';
          if (current) return f; // on garde l’hydratation existante

          // sinon on essaie de pré-remplir depuis editingHarvest
          const zId =
            editingHarvest?.zone?.id ??
            editingHarvest?.zoneId ??
            editingHarvest?.zoneIdSnapshot ??
            null;

          if (zId && list.some((z: any) => String(z.id) === String(zId))) {
            return { ...f, zone: String(zId) };
          }
          return f; // laisse vide si indéterminable
        });
      } catch (err) {
        if (!ac.signal.aborted) setZones([]); // fallback silencieux, comme avant
      }
    })();

    return () => ac.abort();
  }, [showHarvestModal, fieldId, editingHarvest?.field?.id]);

  // Actions disponibles avec leurs icônes
  const actions = [
    {
      id: 'add-harvests',
      label: 'Ajouter des récoltes',
      icon: Sprout,
      color: 'text-green-600',
    },
    {
      id: 'members',
      label: 'Ajouter des membres',
      icon: Users,
      color: 'text-gray-600',
    },
    {
      id: 'add-stocks',
      label: 'Ajouter des stocks',
      icon: Warehouse,
      color: 'text-blue-600',
    },
    {
      id: 'add-equipements',
      label: 'Ajouter des équipements',
      icon: Tractor,
      color: 'text-orange-600',
    },
  ];

  // Fermer le dropdown si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleActionClick = (action) => {
    console.log(`Action sélectionnée: ${action.label}`);

    if (action.id === 'add-harvests') {
      setShowHarvestModal(true);
    }

    if (action.id === 'members') {
      setShowAddMembers(true);
    }

    if (action.id === 'add-stocks') {
      setShowAddStocks(true);
    }

    if (action.id === 'add-equipements') {
      setShowAddEquipements(true);
    }
    setIsOpen(false);
  };

  // Gestion du formulaire de récolte
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setHarvestForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitHarvest = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = isEditMode
        ? await updateHarvest(String(editingHarvest.id), harvestForm)
        : await createHarvest(String(fieldId), harvestForm);

      console.log('Récolte OK :', data);
      onSubmit?.(data);

      if (isEditMode) {
        setIsEditMode(false);
      } else {
        resetForm?.();
      }

      setShowHarvestModal(false);

      // Idéalement, mets à jour ton state parent au lieu de recharger la page :
      // setHarvests(prev => isEditMode
      //   ? prev.map(h => h.id === data.id ? data : h)
      //   : [data, ...prev]
      // );
      // Si tu veux garder le reload :
      setTimeout(() => window.location.reload(), 200);
    } catch (err) {
      console.error('ERREUR API récolte :', err);
    }
  };

  const resetForm = () => {
    setHarvestForm({
      cropType: '',
      plantingDate: '',
      variety: '',
      zone: '',
      harvestDate: '',
      pesticidesUsed: '',
      problemsEncountered: '',
      yieldTonnes: '',
      harvestQuality: '',
      notes: '',
    });
    setIsEditMode(false);
    setShowHarvestModal(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton principal */}
      <button
        className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Plus className="w-4 h-4 mr-2" />
        Actions
      </button>
      {/* Menu dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
          <div className="py-2">
            {actions.map((action) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => handleActionClick(action)}
                  className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                >
                  <IconComponent className={`w-5 h-5 mr-3 ${action.color}`} />
                  <span className="text-gray-700 font-medium">
                    {action.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal d'ajout de récolte */}
      {showHarvestModal && (
        <div className="fixed inset-0 bg-opacity-100 backdrop-blur-md backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Header de la modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center">
                <Sprout className="w-7 h-7 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800">
                  {isEditMode ? 'Modifier la récolte' : 'Ajouter une récolte'}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-white hover:bg-opacity-60 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmitHarvest} className="p-6 space-y-8">
              {/* Question préliminaire - seulement en mode création */}
              {!isEditMode && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <HelpCircle className="w-6 h-6 text-blue-600 mr-3" />
                    <h3 className="text-lg font-semibold text-blue-800">
                      Question préliminaire
                    </h3>
                  </div>
                  <label className="block text-sm font-medium text-blue-700 mb-4">
                    Avez-vous déjà récolté cette culture ?
                  </label>
                  <div className="flex space-x-6">
                    <label className="flex items-center bg-white bg-opacity-60 px-4 py-3 rounded-lg border border-blue-200 hover:bg-opacity-80 transition-all cursor-pointer">
                      <input
                        type="radio"
                        name="isHarvested"
                        value="true"
                        checked={isHarvested === true}
                        onChange={(e) =>
                          setIsHarvested(e.target.value === 'true')
                        }
                        className="mr-3 text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      <span className="text-blue-800 font-medium">
                        Oui, j'ai déjà récolté
                      </span>
                    </label>
                    <label className="flex items-center bg-white bg-opacity-60 px-4 py-3 rounded-lg border border-blue-200 hover:bg-opacity-80 transition-all cursor-pointer">
                      <input
                        type="radio"
                        name="isHarvested"
                        value="false"
                        checked={isHarvested === false}
                        onChange={(e) =>
                          setIsHarvested(e.target.value === 'true')
                        }
                        className="mr-3 text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      <span className="text-blue-800 font-medium">
                        Non, pas encore récolté
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Section 1: Informations générales */}
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                <div className="flex items-center mb-6">
                  <Leaf className="w-6 h-6 text-green-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-800">
                    Informations de la culture
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de culture *
                    </label>
                    <select
                      name="cropType"
                      value={harvestForm.cropType}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
                    >
                      <option value="">Sélectionner une culture</option>
                      <option value="riz">🌾 Riz</option>
                      <option value="mais">🌽 Maïs</option>
                      <option value="ble">🌾 Blé</option>
                      <option value="orge">🌾 Orge</option>
                      <option value="millet">🌾 Millet</option>
                      <option value="sorgho">🌾 Sorgho</option>
                      <option value="avoine">🌾 Avoine</option>
                      <option value="seigle">🌾 Seigle</option>
                      <option value="arachide">🥜 Arachide</option>
                      <option value="soja">🌱 Soja</option>
                      <option value="haricot">🫘 Haricot</option>
                      <option value="pois">🟢 Pois</option>
                      <option value="lentille">🔴 Lentille</option>
                      <option value="fève">🫘 Fève</option>
                      <option value="niébé">🫘 Niébé</option>
                      <option value="coton">🌿 Coton</option>
                      <option value="colza">🌼 Colza</option>
                      <option value="tournesol">🌻 Tournesol</option>
                      <option value="palme">🌴 Palmier à huile</option>
                      <option value="sésame">⚪ Sésame</option>
                      <option value="ricin">🌿 Ricin</option>
                      <option value="igname">🍠 Igname</option>
                      <option value="manioc">🥔 Manioc</option>
                      <option value="patate-douce">🍠 Patate douce</option>
                      <option value="pomme-de-terre">🥔 Pomme de terre</option>
                      <option value="taro">🌿 Taro</option>
                      <option value="tomate">🍅 Tomate</option>
                      <option value="oignon">🧅 Oignon</option>
                      <option value="ail">🧄 Ail</option>
                      <option value="piment">🌶️ Piment</option>
                      <option value="poivron">🫑 Poivron</option>
                      <option value="concombre">🥒 Concombre</option>
                      <option value="carotte">🥕 Carotte</option>
                      <option value="chou">🥬 Chou</option>
                      <option value="laitue">🥗 Laitue</option>
                      <option value="gombo">🌿 Gombo</option>
                      <option value="courgette">🥒 Courgette</option>
                      <option value="aubergine">🍆 Aubergine</option>
                      <option value="banane">🍌 Banane</option>
                      <option value="mangue">🥭 Mangue</option>
                      <option value="orange">🍊 Orange</option>
                      <option value="citron">🍋 Citron</option>
                      <option value="ananas">🍍 Ananas</option>
                      <option value="pastèque">🍉 Pastèque</option>
                      <option value="melon">🍈 Melon</option>
                      <option value="pomme">🍎 Pomme</option>
                      <option value="poire">🍐 Poire</option>
                      <option value="fraise">🍓 Fraise</option>
                      <option value="raisin">🍇 Raisin</option>
                      <option value="avocat">🥑 Avocat</option>
                      <option value="papaye">🥭 Papaye</option>
                      <option value="cajou">🌰 Noix de cajou</option>
                      <option value="coco">🥥 Noix de coco</option>
                      <option value="cafe">☕ Café</option>
                      <option value="cacao">🍫 Cacao</option>
                      <option value="basilic">🌿 Basilic</option>
                      <option value="menthe">🌿 Menthe</option>
                      <option value="thym">🌿 Thym</option>
                      <option value="romarin">🌿 Romarin</option>
                      <option value="gingembre">🫚 Gingembre</option>
                      <option value="curcuma">🟠 Curcuma</option>
                      <option value="autre">📦 Autre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Variété utilisée
                    </label>
                    <input
                      type="text"
                      name="variety"
                      value={harvestForm.variety}
                      onChange={handleFormChange}
                      placeholder="Ex: Sahel 108, 55-437, Souna 3..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Zone du champ
                    </label>
                    <select
                      name="zone"
                      value={harvestForm.zone ?? ''} // 🔒 jamais undefined
                      onChange={(e) =>
                        setHarvestForm((f) => ({ ...f, zone: e.target.value }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
                    >
                      <option value="">-- Sélectionner une zone --</option>
                      {zones.map((zone) => (
                        <option key={zone.id} value={String(zone.id)}>
                          📍 {zone.name} - {zone.percentage}%
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Planification et dates */}
              <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
                <div className="flex items-center mb-6">
                  <Calendar className="w-6 h-6 text-amber-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-800">
                    Planification et dates
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📅 Date de plantation
                    </label>
                    <input
                      type="date"
                      name="plantingDate"
                      value={harvestForm.plantingDate}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🗓️ Date de récolte{' '}
                      {!isEditMode && !isHarvested ? '(prévue)' : ''}
                    </label>
                    <input
                      type="date"
                      name="harvestDate"
                      value={harvestForm.harvestDate}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Informations de récolte (conditionnel) */}
              {(isEditMode || isHarvested) && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
                  <div className="flex items-center mb-6">
                    <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                    <h3 className="text-xl font-semibold text-green-800">
                      Résultats de la récolte{' '}
                      {isEditMode && (
                        <span className="text-sm font-normal text-green-600">
                          (facultatif)
                        </span>
                      )}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ⭐ Qualité de la récolte
                      </label>
                      <select
                        name="harvestQuality"
                        value={harvestForm.harvestQuality}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
                      >
                        <option value="">Sélectionner la qualité</option>
                        <option value="excellente">🌟 Excellente</option>
                        <option value="bonne">✅ Bonne</option>
                        <option value="moyenne">⚖️ Moyenne</option>
                        <option value="faible">⚠️ Faible</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ⚖️ Rendement total (tonnes)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        name="yieldTonnes"
                        value={harvestForm.yieldTonnes}
                        onChange={handleFormChange}
                        placeholder="Ex: 2.5"
                        className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Section 4: Techniques et traitements */}
              <div className="bg-purple-50 rounded-xl border border-purple-200 p-6">
                <div className="flex items-center mb-6">
                  <Beaker className="w-6 h-6 text-purple-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-800">
                    Techniques et traitements
                  </h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    🧪 Pesticides et engrais utilisés
                  </label>
                  <input
                    type="text"
                    name="pesticidesUsed"
                    value={harvestForm.pesticidesUsed}
                    onChange={handleFormChange}
                    placeholder="Ex: Engrais NPK, Herbicide Glyphosate, Insecticide bio..."
                    className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Section 5: Observations et notes */}
              <div className="bg-orange-50 rounded-xl border border-orange-200 p-6">
                <div className="flex items-center mb-6">
                  <FileText className="w-6 h-6 text-orange-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-800">
                    Observations et notes
                  </h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      ⚠️ Problèmes rencontrés
                    </label>
                    <textarea
                      name="problemsEncountered"
                      value={harvestForm.problemsEncountered}
                      onChange={handleFormChange}
                      rows="4"
                      placeholder="Ex: Sécheresse, attaque de parasites, maladies..."
                      className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      📝 Notes additionnelles
                    </label>
                    <textarea
                      name="notes"
                      value={harvestForm.notes}
                      onChange={handleFormChange}
                      rows="4"
                      placeholder="Observations, commentaires, recommandations pour la prochaine saison..."
                      className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex justify-end space-x-4 pt-8 border-t-2 border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex items-center px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium border border-gray-200"
                >
                  <X className="w-4 h-4 mr-2" />
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex items-center px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium transform hover:scale-105"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {isEditMode ? 'Mettre à jour' : 'Enregistrer la récolte'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddMembers && (
        <AddMemberModal
          source="ActionsDropdown"
          farmerId={farmerId}
          showAddMembers={showAddMembers}
          setShowAddMembers={setShowAddMembers}
          selectedMember={null}
          onSave={onMemberSaved}
        />
      )}

      {showAddStocks && (
        <AgriculturalDashboard
          showAddStocks={showAddStocks}
          setShowAddStocks={setShowAddStocks}
        />
      )}
      {showAddEquipements && (
        <EquipmentAddModal
          showAddEquipements={showAddEquipements}
          setShowAddEquipements={setShowAddEquipements}
        />
      )}
    </div>
  );
}
