'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Search,
  Filter,
  Wrench,
  Calendar,
  MapPin,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Tractor,
  Droplets,
  Hammer,
  Settings,
  Plus,
  Eye,
  Edit3,
  Hash,
  Building,
  Trash2,
  X,
  FileText,
} from 'lucide-react';
import EquipmentAddModal from '../../field/[fieldId]/components/addEquipement/addEquipement';
import { ExpandableText } from '../../field/[fieldId]/components/expandableText/expandableText';
import {
  deleteEquipement,
  getEquipementsByFarmer,
  quickEditEquipement,
} from '../../../../../../../api/equipements';

const EquipmentDisplayPage = () => {
  const params = useParams<{ farmerId: string }>();
  const farmerId = params.farmerId;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [equipmentItems, setEquipmentItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAddEquipements, setShowAddEquipements] = useState(false);
  const [mAJ, setMAJ] = useState(false);
  const [maintenanceToday, setMaintenanceToday] = useState(false);
  const [formData, setFormData] = useState({
    lastMaintenanceDate: '',
    nextMaintenanceDate: selectedItem?.nextMaintenanceDate || '',
    condition: selectedItem?.condition || '',
    notes: selectedItem?.notes || '',
  });

  useEffect(() => {
    if (!farmerId) return;
    const ac = new AbortController();

    (async () => {
      try {
        const data: any[] = await getEquipementsByFarmer(String(farmerId));
        if (!ac.signal.aborted) setEquipmentItems(data);
      } catch (err) {
        if (!ac.signal.aborted)
          console.error('Erreur fetch équipements :', err);
      }
    })();

    return () => ac.abort();
  }, [farmerId]);

  const handleUpdate = (data) => {
    setEquipmentItems((prev) => {
      const ix = prev.findIndex((f) => f.id === data.id);
      if (ix === -1) return [data, ...prev]; // ✅ ajout
      const next = prev.slice();
      next[ix] = { ...prev[ix], ...data }; // ✅ édition
      return next;
    });
  };

  const categories = {
    all: {
      name: 'Tous les équipements',
      icon: <Wrench className="w-4 h-4 text-gray-600" />,
      color: 'text-gray-600',
    },
    tracteurs: {
      name: 'Tracteurs',
      icon: <Tractor className="w-4 h-4 text-blue-600" />,
      color: 'text-blue-600',
    },
    irrigation: {
      name: 'Irrigation',
      icon: <Droplets className="w-4 h-4 text-cyan-600" />,
      color: 'text-cyan-600',
    },
    'outils-manuels': {
      name: 'Outils manuels',
      icon: <Hammer className="w-4 h-4 text-orange-600" />,
      color: 'text-orange-600',
    },
    machines: {
      name: 'Machines agricoles',
      icon: <Settings className="w-4 h-4 text-purple-600" />,
      color: 'text-purple-600',
    },
  };

  // Fonction pour déterminer si la maintenance est due
  const getMaintenanceStatus = (nextMaintenanceDate) => {
    if (!nextMaintenanceDate) return null;
    const nextDate = new Date(nextMaintenanceDate);
    const today = new Date();
    const oneMonthFromNow = new Date(
      today.getTime() + 30 * 24 * 60 * 60 * 1000
    );

    if (nextDate < today) return 'overdue';
    if (nextDate <= oneMonthFromNow) return 'due';
    return 'good';
  };

  // Couleurs selon l'état de l'équipement
  const getConditionColor = (condition) => {
    switch (condition.toLowerCase()) {
      case 'neuf':
      case 'excellent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'très bon état':
      case 'très bon':
      case 'bon état':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'état moyen':
      case 'usure normale':
      case 'usé':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'à réparer':
      case 'à réviser':
      case 'révision nécessaire':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'hors service':
      case 'à remplacer':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      await deleteEquipement(itemId);
      setEquipmentItems((prev) => prev.filter((f: any) => f.id !== itemId));
      console.log('Équipement correctement supprimé');
    } catch (err) {
      console.error('Erreur lors de la suppression :', err);
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowAddEquipements(true);
  };

  const handleMaintenanceTodayChange = (value) => {
    setMaintenanceToday(value);
    if (value) {
      // Si maintenance aujourd'hui, on met automatiquement la date d'aujourd'hui
      const today = new Date().toISOString().split('T')[0];
      setFormData((prev) => ({
        ...prev,
        lastMaintenanceDate: today,
      }));
    } else {
      // Sinon on remet à vide pour que l'utilisateur puisse choisir
      setFormData((prev) => ({
        ...prev,
        lastMaintenanceDate: '',
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (equipementId: string) => {
    if (!formData.condition) {
      alert("Veuillez sélectionner un état pour l'équipement");
      return;
    }

    if (!maintenanceToday && !formData.lastMaintenanceDate) {
      alert('Veuillez indiquer la date de dernière maintenance');
      return;
    }

    const toSend = { ...formData, maintenanceToday };

    try {
      const data = await quickEditEquipement(equipementId, toSend);
      console.log('Équipement mis à jour', data);

      // Si tu as déjà une fonction…
      handleUpdate?.(data);

      // …ou mets à jour la liste localement :
      // setEquipmentItems(prev => prev.map((it: any) => it.id === data.id ? data : it));

      setMAJ(false);
    } catch (err) {
      console.error('Erreur API (quickEdit):', err);
    }
  };

  // Couleurs selon le statut de maintenance
  const getMaintenanceColor = (status) => {
    switch (status) {
      case 'overdue':
        return 'bg-red-50 text-red-700 border border-red-200';
      case 'due':
        return 'bg-orange-50 text-orange-700 border border-orange-200';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  const filteredItems = equipmentItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const equipmentCategories = {
    tracteurs: {
      name: 'Tracteurs',
      icon: <Tractor className="w-5 h-5" />,
      subcategories: [
        'Tracteur agricole',
        'Micro-tracteur',
        'Tracteur-tondeuse',
        'Tracteur vignoble',
      ],
      conditions: [
        'Neuf',
        'Très bon état',
        'Bon état',
        'État moyen',
        'À réparer',
      ],
    },
    irrigation: {
      name: 'Irrigation',
      icon: <Droplets className="w-5 h-5" />,
      subcategories: [
        'Système goutte-à-goutte',
        'Asperseurs',
        'Pompes',
        'Tuyaux et raccords',
        'Programmateurs',
      ],
      conditions: [
        'Neuf',
        'Excellent',
        'Bon état',
        'Usure normale',
        'À remplacer',
      ],
    },
    'outils-manuels': {
      name: 'Outils manuels',
      icon: <Hammer className="w-5 h-5" />,
      subcategories: [
        'Bêches et pelles',
        'Sécateurs',
        'Pulvérisateurs manuels',
        'Brouettes',
        'Outils de jardinage',
      ],
      conditions: ['Neuf', 'Très bon', 'Bon état', 'Usé', 'À remplacer'],
    },
    machines: {
      name: 'Machines agricoles',
      icon: <Settings className="w-5 h-5" />,
      subcategories: [
        'Moissonneuses',
        'Semoirs',
        'Pulvérisateurs',
        'Épandeurs',
        'Tondeuses',
      ],
      conditions: [
        'Neuf',
        'Excellent',
        'Bon état',
        'Révision nécessaire',
        'Hors service',
      ],
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white max-w-7xl mx-auto px-6 py-4 rounded-xl border">
        {showAddEquipements && (
          <EquipmentAddModal
            showAddEquipements={showAddEquipements}
            setShowAddEquipements={setShowAddEquipements}
            selectedItem={selectedItem}
            onSave={handleUpdate}
          />
        )}

        <div className="py-5 mb-2">
          <div className="flex justify-between items-start px-6 gap-4 flex-wrap">
            <div className="flex-1 min-w-[350px]">
              <h2 className="text-2xl font-semibold text-black">
                Gestion des Equipements
              </h2>
              <p className="text-gray-900 text-sm mt-1 max-w-3xl">
                Ajoutez vos équipements (tracteurs, outils…) pour suivre leur
                état et recevoir des rappels de maintenance.
              </p>
            </div>

            <button
              onClick={() => setShowAddEquipements(true)}
              className="cursor-pointer shrink-0 bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2 h-11"
            >
              <Plus className="h-4 w-4" />
              Ajouter des équipements
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher un produit, fournisseur ou lieu de stockage..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="flex space-x-2 overflow-x-auto">
              {Object.entries(categories).map(([key, cat]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`cursor-pointer px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center space-x-2 transition-colors ${
                    selectedCategory === key
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grille des cartes d'équipements */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const maintenanceStatus = getMaintenanceStatus(
              item.nextMaintenanceDate
            );

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                {/* En-tête de carte */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${categories[
                          item.category
                        ].color
                          .replace('text-', 'bg-')
                          .replace('-600', '-100')}`}
                      >
                        {categories[item.category].icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {item.subcategory}
                        </p>
                        <p className="text-xs text-gray-400">
                          {item.brand} {item.model}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Supprimer cet équipement ?'))
                            handleDelete(item.id);
                        }}
                        className="p-1 text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Corps de carte */}
                <div className="p-4 space-y-3">
                  {/* Quantité et état */}
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold text-gray-800">
                      {item.quantity}{' '}
                      <span className="text-sm font-normal text-gray-500">
                        unité{item.quantity > 1 ? 's' : ''}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getConditionColor(
                        item.condition
                      )}`}
                    >
                      {item.condition}
                    </span>
                  </div>

                  {/* Localisation */}
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="truncate">{item.location}</span>
                  </div>

                  {/* Numéro de série */}
                  {item.serialNumber && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Hash className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="truncate font-mono text-xs">
                        {item.serialNumber.toUpperCase()}
                      </span>
                    </div>
                  )}

                  {/* Fournisseur */}
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="truncate">{item.supplier}</span>
                  </div>

                  {/* Prix d'achat */}
                  <div className="flex items-center text-sm">
                    <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="font-medium text-green-600">
                      {item.purchasePrice.toLocaleString()}€
                    </span>
                    {item.quantity > 1 && (
                      <span className="text-gray-500 ml-1">
                        ({(item.purchasePrice / item.quantity).toLocaleString()}
                        €/unité)
                      </span>
                    )}
                  </div>

                  {/* Statut de maintenance */}
                  {item.nextMaintenanceDate && (
                    <div
                      className={`flex items-center text-sm p-2 rounded-lg ${getMaintenanceColor(
                        maintenanceStatus
                      )}`}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>
                        {maintenanceStatus === 'overdue'
                          ? `MAINTENANCE EN RETARD depuis le ${new Date(
                              item.nextMaintenanceDate
                            ).toLocaleDateString('fr-FR')}`
                          : maintenanceStatus === 'due'
                          ? `Maintenance prévue le ${new Date(
                              item.nextMaintenanceDate
                            ).toLocaleDateString('fr-FR')}`
                          : `Prochaine maintenance: ${new Date(
                              item.nextMaintenanceDate
                            ).toLocaleDateString('fr-FR')}`}
                      </span>
                      {maintenanceStatus === 'overdue' && (
                        <AlertTriangle className="w-4 h-4 ml-auto text-red-500" />
                      )}
                      {maintenanceStatus === 'due' && (
                        <AlertTriangle className="w-4 h-4 ml-auto text-orange-500" />
                      )}
                    </div>
                  )}

                  {/* Notes */}
                  {item.notes && (
                    <ExpandableText
                      text={item.notes}
                      maxLength={120}
                      label="Notes:"
                      bgColor="bg-gray-50"
                      textColor="text-gray-600"
                    />
                  )}

                  <div className={`flex items-center text-sm p-2 rounded-lg`}>
                    <span className="w-full">
                      <button
                        onClick={() => {
                          setSelectedItem(item); // stocke l'item cliqué
                          setMAJ(true); // affiche la modale
                        }}
                        className="w-full px-4 py-3 bg-green-400 hover:bg-green-100 text-gray-700 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 border border-gray-200 hover:border-gray-300"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        <span>Mettre à jour</span>
                      </button>
                    </span>
                  </div>
                </div>
                {mAJ && selectedItem && (
                  <div className="fixed inset-0 bg-opacity-100 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                      {/* Header */}
                      <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Wrench className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                              Mettre à jour l'équipement
                            </h3>
                            <p className="text-sm text-gray-500">
                              {selectedItem.name}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setMAJ(false)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Body */}
                      <div className="p-6 space-y-6">
                        {/* Informations actuelles */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="text-gray-500 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">
                                Marque/Modèle:
                              </span>
                              <div className="font-medium">
                                {selectedItem.brand} {selectedItem.model}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600">
                                Localisation:
                              </span>
                              <div className="font-medium">
                                {selectedItem.location}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600">
                                État actuel:
                              </span>
                              <div className="font-medium">
                                {selectedItem.condition}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600">
                                Dernière maintenance:
                              </span>
                              <div className="font-medium">
                                {selectedItem.lastMaintenanceDate
                                  ? new Date(
                                      selectedItem.lastMaintenanceDate
                                    ).toLocaleDateString('fr-FR')
                                  : 'Non renseignée'}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Question maintenance aujourd'hui */}
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                            Maintenance effectuée aujourd'hui ?
                          </h4>
                          <div className="space-y-3">
                            <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                              <input
                                type="radio"
                                name="maintenanceToday"
                                checked={maintenanceToday === true}
                                onChange={() =>
                                  handleMaintenanceTodayChange(true)
                                }
                                className="text-gray-500 w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                              />
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-800">
                                  Oui, j'ai fait la maintenance aujourd'hui
                                </div>
                                <div className="text-xs text-gray-500">
                                  La date sera automatiquement mise à
                                  aujourd'hui
                                </div>
                              </div>
                            </label>

                            <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                              <input
                                type="radio"
                                name="maintenanceToday"
                                checked={maintenanceToday === false}
                                onChange={() =>
                                  handleMaintenanceTodayChange(false)
                                }
                                className="text-gray-500 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              />
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-800">
                                  Non, je veux juste mettre à jour les
                                  informations
                                </div>
                                <div className="text-xs text-gray-500">
                                  Possibilité de modifier la date de dernière
                                  maintenance
                                </div>
                              </div>
                            </label>
                          </div>
                        </div>

                        {/* Date de dernière maintenance (si pas aujourd'hui) */}
                        {!maintenanceToday && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              Date de dernière maintenance *
                            </label>
                            <input
                              type="date"
                              name="lastMaintenanceDate"
                              value={formData.lastMaintenanceDate}
                              onChange={handleInputChange}
                              className="text-gray-500 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        )}

                        {/* Date de prochaine maintenance */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Prochaine maintenance prévue
                          </label>
                          <input
                            type="date"
                            name="nextMaintenanceDate"
                            value={formData.nextMaintenanceDate}
                            onChange={handleInputChange}
                            className="text-gray-500 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        {/* État de l'équipement */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            État de l'équipement *
                          </label>
                          <select
                            name="condition"
                            value={formData.condition}
                            onChange={handleInputChange}
                            className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          >
                            <option value="">Sélectionner l'état</option>
                            {(
                              equipmentCategories[selectedItem.category]
                                ?.conditions || []
                            ).map((condition) => (
                              <option key={condition} value={condition}>
                                {condition}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Notes */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <FileText className="w-4 h-4 mr-1" />
                            Notes de maintenance
                          </label>
                          <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            rows={4}
                            className="text-gray-500 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Décrivez les opérations effectuées, les pièces changées, les observations..."
                          />
                        </div>

                        {/* Aperçu des modifications */}
                        {(formData.condition !== selectedItem.condition ||
                          formData.notes !== selectedItem.notes ||
                          formData.nextMaintenanceDate !==
                            selectedItem.nextMaintenanceDate) && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-medium text-blue-800 mb-2">
                              Aperçu des modifications :
                            </h4>
                            <div className="space-y-1 text-sm text-blue-700">
                              {formData.condition !==
                                selectedItem.condition && (
                                <div>
                                  • État : {selectedItem.condition} →{' '}
                                  <strong>{formData.condition}</strong>
                                </div>
                              )}
                              {formData.nextMaintenanceDate !==
                                selectedItem.nextMaintenanceDate && (
                                <div>
                                  • Prochaine maintenance :{' '}
                                  {formData.nextMaintenanceDate
                                    ? new Date(
                                        formData.nextMaintenanceDate
                                      ).toLocaleDateString('fr-FR')
                                    : 'Non planifiée'}
                                </div>
                              )}
                              {maintenanceToday && (
                                <div>
                                  • Dernière maintenance mise à jour à
                                  aujourd'hui
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex space-x-3 p-6 border-t border-gray-200">
                        <button
                          onClick={() => setMAJ(false)}
                          className="flex-1 px-4 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={() => handleSave(selectedItem.id)}
                          className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
                        >
                          <Wrench className="w-4 h-4" />
                          <span>Mettre à jour</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* État vide */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Tractor className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Aucun équipement trouvé
            </h3>
            <p className="text-gray-500">
              Essayez de modifier vos critères de recherche ou de filtrage
            </p>
          </div>
        )}

        {/* Statistiques rapides */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {
                    equipmentItems.filter((item) =>
                      [
                        'neuf',
                        'excellent',
                        'très bon état',
                        'très bon',
                        'bon état',
                      ].includes(item.condition.toLowerCase())
                    ).length
                  }
                </p>
                <p className="text-sm text-gray-500">Bon état</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {
                    equipmentItems.filter((item) =>
                      ['à réviser', 'révision nécessaire'].includes(
                        item.condition.toLowerCase()
                      )
                    ).length
                  }
                </p>
                <p className="text-sm text-gray-500">À réviser</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {
                    equipmentItems.filter((item) =>
                      ['à réparer', 'hors service'].includes(
                        item.condition.toLowerCase()
                      )
                    ).length
                  }
                </p>
                <p className="text-sm text-gray-500">À réparer</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {
                    equipmentItems.filter(
                      (item) =>
                        item.nextMaintenanceDate &&
                        getMaintenanceStatus(item.nextMaintenanceDate) === 'due'
                    ).length
                  }
                </p>
                <p className="text-sm text-gray-500">Maintenance due</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {
                    equipmentItems.filter(
                      (item) =>
                        item.nextMaintenanceDate &&
                        getMaintenanceStatus(item.nextMaintenanceDate) ===
                          'overdue'
                    ).length
                  }
                </p>
                <p className="text-sm text-gray-500">En retard</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDisplayPage;
