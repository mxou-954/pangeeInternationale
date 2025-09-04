'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  X,
  Wrench,
  Tractor,
  Droplets,
  Hammer,
  Settings,
  MapPin,
  Calendar,
  Hash,
  Building,
  Package,
  FileText,
  NotepadTextDashedIcon,
} from 'lucide-react';
import {
  createEquipementForFarmer,
  updateEquipement,
} from '../../../../../../../../../api/equipements';

const EMPTY_EQUIP_FORM: any = {
  name: '',
  category: '',
  subcategory: '',
  brand: '',
  model: '',
  serialNumber: '',
  quantity: 0,
  purchasePrice: 0,
  supplier: '',
  purchaseDate: '',
  lastMaintenanceDate: '',
  nextMaintenanceDate: '',
  location: '',
  condition: '',
  notes: '',
};

const EquipmentAddModal = ({
  showAddEquipements,
  setShowAddEquipements,
  selectedItem,
  onSave,
}) => {
  const params = useParams<{ farmerId: string }>();
  const farmerId = params.farmerId;
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    brand: '',
    model: '',
    serialNumber: '',
    quantity: 0,
    purchasePrice: 0,
    supplier: '',
    purchaseDate: '',
    lastMaintenanceDate: '',
    nextMaintenanceDate: '',
    location: '',
    condition: '',
    notes: '',
  });

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (selectedItem) {
      setFormData(selectedItem);
    }
  }, [selectedItem]);

  const equipmentCategories = {
    tracteurs: {
      name: 'Tracteurs',
      icon: <Tractor className="w-5 h-5" />,
      subcategories: [
        'Tracteur agricole',
        'Micro-tracteur',
        'Tracteur-tondeuse',
        'Tracteur vignoble',
        'Tracteur forestier',
        'Tracteur verger',
        'Tracteur articulé',
        'Tracteur à chenilles',
      ],
      conditions: [
        'Neuf',
        'Très bon état',
        'Bon état',
        'État moyen',
        'À réparer',
      ],
    },
    machines: {
      name: 'Machines agricoles',
      icon: <Settings className="w-5 h-5" />,
      subcategories: [
        'Moissonneuses-batteuses',
        'Ensileuses',
        'Faucheuses',
        'Andaineurs',
        'Presse à balles',
        'Semoirs',
        'Planteuses',
        'Pulvérisateurs',
        'Épandeurs d’engrais',
        'Épandeurs de fumier',
        'Broyeurs',
        'Débroussailleuses',
        'Tondeuses',
        'Arracheuses',
        'Matériel de récolte (pommes, vignes, légumes)',
        'Matériel de fenaison',
        'Matériel viticole spécialisé',
      ],
      conditions: [
        'Neuf',
        'Excellent',
        'Bon état',
        'Révision nécessaire',
        'Hors service',
      ],
    },
    outilsManuels: {
      name: 'Outils manuels',
      icon: <Hammer className="w-5 h-5" />,
      subcategories: [
        'Bêches et pelles',
        'Fourches',
        'Râteaux',
        'Houe et binettes',
        'Sécateurs',
        'Cisailles',
        'Ébrancheurs',
        'Pulvérisateurs manuels',
        'Arrosoirs',
        'Brouettes',
        'Outils de greffage',
        'Outils de désherbage',
        'Outils de jardinage divers',
      ],
      conditions: ['Neuf', 'Très bon', 'Bon état', 'Usé', 'À remplacer'],
    },
    irrigation: {
      name: 'Irrigation',
      icon: <Droplets className="w-5 h-5" />,
      subcategories: [
        'Système goutte-à-goutte',
        'Asperseurs',
        'Pompes',
        'Motopompes',
        'Tuyaux et raccords',
        'Programmateurs',
        'Filtres',
        'Bassins et réservoirs',
        'Enrouleurs d’irrigation',
      ],
      conditions: [
        'Neuf',
        'Excellent',
        'Bon état',
        'Usure normale',
        'À remplacer',
      ],
    },
    entretienSol: {
      name: 'Travail du sol',
      icon: <Settings className="w-5 h-5" />,
      subcategories: [
        'Charrues',
        'Herses',
        'Rotavators',
        'Cultivateurs',
        'Décompacteurs',
        'Sous-soleuses',
        'Cover-crops',
      ],
      conditions: [
        'Neuf',
        'Très bon état',
        'Bon état',
        'État moyen',
        'À réparer',
      ],
    },
    transport: {
      name: 'Transport et remorques',
      icon: <Settings className="w-5 h-5" />,
      subcategories: [
        'Remorques agricoles',
        'Bennes basculantes',
        'Plateaux',
        'Chariots élévateurs agricoles',
        'Manitous / télescopiques',
        'Petits véhicules utilitaires agricoles',
      ],
      conditions: [
        'Neuf',
        'Très bon état',
        'Bon état',
        'État moyen',
        'À réparer',
      ],
    },
    elevage: {
      name: 'Élevage et soins animaux',
      icon: <Settings className="w-5 h-5" />,
      subcategories: [
        'Abreuvoirs',
        'Mangeoires',
        'Clôtures électriques',
        'Matériel de traite',
        'Brosses à vaches',
        'Cages et enclos',
        'Matériel de pesée',
      ],
      conditions: [
        'Neuf',
        'Très bon état',
        'Bon état',
        'État moyen',
        'À réparer',
      ],
    },
    serres: {
      name: 'Serres et horticulture',
      icon: <Settings className="w-5 h-5" />,
      subcategories: [
        'Serres tunnel',
        'Serres en verre',
        'Films plastiques',
        'Filets de protection',
        'Tablettes de culture',
        'Systèmes de chauffage',
        'Éclairage horticole',
      ],
      conditions: [
        'Neuf',
        'Très bon état',
        'Bon état',
        'État moyen',
        'À réparer',
      ],
    },
    protection: {
      name: 'Protection et sécurité',
      icon: <Settings className="w-5 h-5" />,
      subcategories: [
        'Équipements de protection individuelle (EPI)',
        'Casques et lunettes',
        'Gants',
        'Bottes',
        'Combinaisons',
        'Filets de sécurité',
        'Signalisation',
      ],
      conditions: ['Neuf', 'Très bon état', 'Bon état', 'Usé', 'À remplacer'],
    },
    other: {
      name: 'Autre',
      icon: <NotepadTextDashedIcon className="w-5 h-5" />,
      subcategories: ['Autre'],
      conditions: [
        'Neuf',
        'Très bon état',
        'Bon état',
        'État moyen',
        'À réparer',
      ],
    },
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset subcategory when category changes
      ...(name === 'category' ? { subcategory: '', condition: '' } : {}),
    }));
  };

  const handleSubmit = async () => {
    const isEdit = !!selectedItem?.id;

    // Build payload propre (pas d’id/timestamps)
    const base = selectedItem ?? {};
    const merged: any = { ...base, ...formData };
    const { id, createdAt, updatedAt, ...payload } = merged;

    console.log('On envoie :', payload);

    try {
      const data = isEdit
        ? await updateEquipement(String(selectedItem!.id), payload)
        : await createEquipementForFarmer(String(farmerId), payload);

      console.log(isEdit ? 'Équipement mis à jour' : 'Équipement créé', data);
      setShowSuccess(true);
      onSave?.(data); // remonte la donnée au parent si besoin
    } catch (err) {
      console.error('Erreur API :', err);
    } finally {
      // Reset propre du form & fermeture
      setFormData(EMPTY_EQUIP_FORM);
      setShowSuccess(false);
      setShowAddEquipements(false);
    }
  };

  if (!showAddEquipements) return null;

  const selectedCategory = equipmentCategories[formData.category];

  return (
    <div className="fixed inset-0 bg-opacity-100 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Wrench className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Ajouter un équipement
                </h3>
                <p className="text-sm text-gray-500">
                  Enregistrez vos tracteurs, outils et machines agricoles
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddEquipements(false)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mx-6 mt-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
            <span className="text-green-800 font-medium">
              Équipement ajouté avec succès !
            </span>
          </div>
        )}

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Informations générales */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-gray-600" />
              Informations générales
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de l'équipement *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: Tracteur John Deere 6125M"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {Object.entries(equipmentCategories).map(([key, cat]) => (
                    <option key={key} value={key}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCategory && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type d'équipement
                  </label>
                  <select
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleInputChange}
                    className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner un type</option>
                    {selectedCategory.subcategories.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantité
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="1"
                  className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Détails techniques */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-gray-600" />
              Détails techniques
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marque
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: John Deere, Massey Ferguson..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modèle
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Modèle/Référence"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Hash className="w-4 h-4 mr-1" />
                  Numéro de série
                </label>
                <input
                  type="text"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleInputChange}
                  className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="N° de série si disponible"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {selectedCategory && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    État de l'équipement
                  </label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner l'état</option>
                    {selectedCategory.conditions.map((condition) => (
                      <option key={condition} value={condition}>
                        {condition}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  Localisation
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: Hangar principal, Atelier, Champ Nord..."
                />
              </div>
            </div>
          </div>

          {/* Informations d'achat */}
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <Building className="w-5 h-5 mr-2 text-gray-600" />
              Informations d'achat
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fournisseur/Entreprise
                </label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleInputChange}
                  className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Nom de l'entreprise"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix d'achat (€)
                </label>
                <input
                  type="number"
                  name="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date d'achat
                </label>
                <input
                  type="date"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleInputChange}
                  className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Maintenance */}
          <div className="bg-orange-50 rounded-lg p-4">
            <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-gray-600" />
              Suivi de maintenance
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dernière maintenance
                </label>
                <input
                  type="date"
                  name="lastMaintenanceDate"
                  value={formData.lastMaintenanceDate}
                  onChange={handleInputChange}
                  className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prochaine maintenance prévue
                </label>
                <input
                  type="date"
                  name="nextMaintenanceDate"
                  value={formData.nextMaintenanceDate}
                  onChange={handleInputChange}
                  className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <FileText className="w-4 h-4 mr-1" />
              Notes complémentaires
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Informations supplémentaires, historique des réparations, accessoires inclus..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-xl">
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAddEquipements(false)}
              className="flex-1 px-4 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <Wrench className="w-4 h-4" />
              <span>Ajouter l'équipement</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentAddModal;
