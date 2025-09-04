'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Plus,
  Package,
  Calendar,
  MapPin,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Wheat,
  Droplets,
  Wrench,
  Leaf,
  X,
  Warehouse,
  Save,
  Edit2,
  NotepadTextDashedIcon,
  Flower,
  Syringe,
  Bone,
} from 'lucide-react';
import {
  createStockForFarmer,
  updateStockEverything,
} from '../../../../../../../../../api/stocks';

const EMPTY_FORM: any = {
  name: '',
  category: '',
  subcategory: '',
  quantity: '',
  unit: '',
  purchasePrice: '',
  supplier: '',
  purchaseDate: '',
  expirationDate: '',
  storageLocation: '',
  batchNumber: '',
  alertStock: '',
  notes: '',
};

const AgriculturalInventoryPage = ({
  showAddStocks,
  setShowAddStocks,
  selectedItem,
  onSave,
}) => {
  const params = useParams<{ farmerId: string }>();
  const farmerId = params.farmerId;
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    quantity: '',
    unit: '',
    purchasePrice: '',
    supplier: '',
    purchaseDate: '',
    expirationDate: '',
    storageLocation: '',
    batchNumber: '',
    alertStock: '',
    notes: '',
  });
  const [edit, setEdit] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (selectedItem) {
      setFormData(selectedItem);
      setEdit(true);
    }
  }, [selectedItem]);

const categories = {
  semences: {
    name: 'Semences',
    icon: <Wheat className="w-5 h-5" />,
    subcategories: [
      'Céréales (blé, orge, maïs, riz...)',
      'Légumineuses (pois, fèves, lentilles...)',
      'Oléagineux (colza, tournesol, soja...)',
      'Fourragères (luzerne, trèfle, ray-grass...)',
      'Légumes (tomate, carotte, salade, oignon...)',
      'Fruits (melon, pastèque, fraise...)',
      'Plantes aromatiques et médicinales (basilic, thym, lavande...)',
      'Semences hybrides',
      'Semences certifiées',
      'Semences paysannes',
      'Plants et boutures',
      'Bulbes et tubercules (pomme de terre, ail, oignon...)',
      'Semences potagères bio',
    ],
    units: ['kg', 'g', 'litres', 'ml', 'tonnes', 'sacs', 'unités'],
  },
  engrais: {
    name: 'Engrais',
    icon: <Leaf className="w-5 h-5" />,
    subcategories: [
      'Engrais azotés',
      'Engrais phosphatés',
      'Engrais potassiques',
      'Engrais composés (NPK)',
      'Engrais organiques',
      'Amendements calciques (chaux, dolomie)',
      'Amendements organiques (fumier, compost, digestat)',
      'Biostimulants',
      'Engrais foliaires',
      'Engrais liquides',
      'Engrais granulés',
      'Engrais à libération lente',
      'Engrais bio',
    ],
    units: ['kg', 'g', 'litres', 'ml', 'tonnes', 'sacs', 'unités'],
  },
  pesticides: {
    name: 'Produits phytosanitaires',
    icon: <Droplets className="w-5 h-5" />,
    subcategories: [
      'Herbicides',
      'Insecticides',
      'Fongicides',
      'Acaricides',
      'Nématicides',
      'Rodenticides',
      'Molluscicides',
      'Bactéricides',
      'Répulsifs',
      'Produits biologiques (biocontrôle)',
      'Huiles minérales',
      'Adjuvants',
      'Traitements de semences',
    ],
    units: ['kg', 'g', 'litres', 'ml', 'tonnes', 'sacs', 'unités'],
  },
  alimentationAnimale: {
    name: 'Alimentation animale',
    icon: <Bone className="w-5 h-5" />,
    subcategories: [
      'Aliments composés',
      'Concentrés',
      'Farines',
      'Grains',
      'Tourteaux',
      'Fourrages déshydratés',
      'Compléments minéraux et vitaminiques',
      'Additifs nutritionnels',
      'Suppléments bio',
    ],
    units: ['kg', 'g', 'litres', 'ml', 'tonnes', 'sacs', 'unités'],
  },
  produitsVeterinaires: {
    name: 'Produits vétérinaires',
    icon: <Syringe className="w-5 h-5" />,
    subcategories: [
      'Antibiotiques',
      'Antiparasitaires',
      'Vaccins',
      'Vitamines',
      'Désinfectants',
      'Soins cutanés',
      'Produits de reproduction',
    ],
    units: ['kg', 'g', 'litres', 'ml', 'tonnes', 'sacs', 'unités'],
  },
  substrats: {
    name: 'Substrats et amendements horticoles',
    icon: <Flower className="w-5 h-5" />,
    subcategories: [
      'Terreau universel',
      'Terreau horticole',
      'Tourbe',
      'Fibre de coco',
      'Perlite',
      'Vermiculite',
      'Substrats bio',
    ],
    units: ['kg', 'g', 'litres', 'ml', 'tonnes', 'sacs', 'unités'],
  },
  autres: {
    name: 'Autres intrants',
    icon: <NotepadTextDashedIcon className="w-5 h-5" />,
    subcategories: [
      'Filets et bâches agricoles',
      'Produits de désinfection',
      'Colorants et traceurs',
      'Fixateurs et adjuvants',
      'Autre',
    ],
    units: ['kg', 'g', 'litres', 'ml', 'tonnes', 'sacs', 'unités'],
  },
};


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset subcategory when category changes
      ...(name === 'category' ? { subcategory: '', unit: '' } : {}),
    }));
  };

  async function handleSubmit() {
    const isEdit = !!selectedItem?.id;

    // 1) Quantity sûre
    const q = Number(formData.quantity);
    if (Number.isNaN(q)) {
      console.error('Quantité invalide');
      return;
    }

    // 2) Build payload propre (pas d’id / timestamps)
    const merged = { ...(selectedItem ?? {}), ...formData, quantity: q };
    const { id, createdAt, updatedAt, ...payload } = merged as any; // payload = StockPayload
    // (Type hint possible) const payload: StockPayload = { name: merged.name, quantity: q, ... }

    console.log('On envoie :', payload);

    try {
      const data = isEdit
        ? await updateStockEverything(String(selectedItem!.id), payload)
        : await createStockForFarmer(String(farmerId), payload);

      console.log(isEdit ? 'Stock mis à jour' : 'Stock ajouté', data);
      setShowSuccess(true);
      onSave?.(data);
    } catch (err) {
      console.error('Erreur API :', err);
    } finally {
      setEdit(false);
      setFormData(EMPTY_FORM); // évite setFormData({}) pour rester typé/contrôlé
      setShowAddStocks(false);
    }
  }

  const selectedCategory = categories[formData.category];
  const isEdit = !!selectedItem;

  return (
    <div className="fixed inset-0 bg-opacity-100 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Warehouse className="w-8 h-8 mr-3" />
              <div>
                <h2 className="text-2xl font-bold">
                  Gestion des Stocks Agricoles
                </h2>
                <p className="text-blue-100">
                  Ajoutez et gérez vos semences, engrais et équipements
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddStocks(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Success Message */}
          {showSuccess && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">
                Produit ajouté avec succès !
              </span>
            </div>
          )}

          {/* Main Form */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                {edit ? (
                  <>
                    <Edit2 className="w-6 h-6 text-green-600" />
                    <h2 className="text-xl font-semibold text-gray-800">
                      Modifier le produit
                    </h2>
                  </>
                ) : (
                  <>
                    <Plus className="w-6 h-6 text-green-600" />
                    <h2 className="text-xl font-semibold text-gray-800">
                      Ajouter un nouveau produit
                    </h2>
                  </>
                )}
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Product Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du produit *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="text-gray-500 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: Blé dur d'hiver"
                    required
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
                    className="text-gray-500 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {Object.entries(categories).map(([key, cat]) => (
                      <option key={key} value={key}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subcategory and Quantity */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {selectedCategory && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sous-catégorie
                    </label>
                    <select
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleInputChange}
                      className="text-gray-500 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Sélectionner</option>
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
                    Quantité *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="text-gray-500 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                {selectedCategory && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unité *
                    </label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      className="text-gray-500 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Unité</option>
                      {selectedCategory.units.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Purchase Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-gray-600" />
                  Informations d'achat
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix d'achat (€)
                    </label>
                    <input
                      type="number"
                      name="purchasePrice"
                      value={formData.purchasePrice}
                      onChange={handleInputChange}
                      className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fournisseur
                    </label>
                    <input
                      type="text"
                      name="supplier"
                      value={formData.supplier}
                      onChange={handleInputChange}
                      className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Nom du fournisseur"
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

              {/* Storage Info */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-gray-600" />
                  Stockage et traçabilité
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lieu de stockage
                    </label>
                    <input
                      type="text"
                      name="storageLocation"
                      value={formData.storageLocation}
                      onChange={handleInputChange}
                      className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Ex: Hangar A, Silo 2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro de lot
                    </label>
                    <input
                      type="text"
                      name="batchNumber"
                      value={formData.batchNumber}
                      onChange={handleInputChange}
                      className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Référence du lot"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Date d'expiration
                    </label>
                    <input
                      type="date"
                      name="expirationDate"
                      value={formData.expirationDate}
                      onChange={handleInputChange}
                      className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Me prévenir quand le stock est inférieur a
                    </label>
                    <input
                      type="number"
                      name="alertStock"
                      value={formData.alertStock}
                      onChange={handleInputChange}
                      className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes complémentaires
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="text-gray-500 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Informations supplémentaires, conditions de stockage, etc."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  className="px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center space-x-2"
                >
                  {edit ? (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Sauvegarder</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      <span>Ajouter le produit</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgriculturalInventoryPage;
