'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
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
  Plus,
  Eye,
  Edit3,
  Trash2,
  Map,
} from 'lucide-react';
import { X, Minus, Calculator } from 'lucide-react';
import AgriculturalInventoryPage from '../addStocks/addStocks';

const InventoryDisplayPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockItems, setStockItem] = useState([]);
  const [mAJ, setMAJ] = useState(false);
  const [updateType, setUpdateType] = useState('remaining'); // 'remaining' ou 'used'
  const [currentStock, setCurrentStock] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAddStocks, setShowAddStocks] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3005/stocks`)
      .then((response) => {
        if (!response.ok) throw new Error('Erreur de chargement');
        return response.json();
      })
      .then((data) => {
        console.log('Données reçues setStockItem :', data);
        setStockItem(data);
      })
      .catch((err) => {
        console.error('Erreur fetch:', err);
      });
  }, []);

  // Données d'exemple avec la structure complète

  const categories = {
    all: {
      name: 'Tous les produits',
      icon: <Package className="w-4 h-4 text-gray-600" />,
      color: 'text-gray-600',
    },
    semences: {
      name: 'Semences',
      icon: <Wheat className="w-4 h-4 text-amber-600" />,
      color: 'text-amber-600',
    },
    engrais: {
      name: 'Engrais',
      icon: <Leaf className="w-4 h-4 text-green-600" />,
      color: 'text-green-600',
    },
    pesticides: {
      name: 'Pesticides',
      icon: <Droplets className="w-4 h-4 text-blue-600" />,
      color: 'text-blue-600',
    },
  };

  // Calcul du niveau de stock selon les règles
  const getStockLevel = (quantity, alertStock) => {
    if (quantity < Number(alertStock)) return 'critical';
    if (quantity <= Number(alertStock) + 5) return 'low';
    return 'good';
  };

  // Calcul du statut d'expiration
  const getExpirationStatus = (expirationDate) => {
    if (!expirationDate) return null;
    const expDate = new Date(expirationDate);
    const today = new Date();
    const oneMonthFromNow = new Date(
      today.getTime() + 30 * 24 * 60 * 60 * 1000
    );

    if (expDate < today) return 'expired';
    if (expDate <= oneMonthFromNow) return 'expiring';
    return 'good';
  };

  const getStockLevelColor = (level) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'low':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'good':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStockLevelText = (level) => {
    switch (level) {
      case 'critical':
        return 'Critique';
      case 'low':
        return 'Faible';
      case 'good':
        return 'Suffisant';
      default:
        return 'Inconnu';
    }
  };

  const getExpirationColor = (status) => {
    switch (status) {
      case 'expired':
        return 'bg-red-50 text-red-700 border border-red-200';
      case 'expiring':
        return 'bg-orange-50 text-orange-700 border border-orange-200';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  const handleSave = async () => {
    if (!currentStock || currentStock === '') {
      alert('Veuillez saisir une quantité');
      return;
    }

    const numInput = parseFloat(currentStock);
    const baseQuantity = parseFloat(selectedItem.quantity);
    let newStock;

    if (updateType === 'remaining') {
      newStock = numInput;
    } else if (updateType === 'used') {
      newStock = baseQuantity - numInput;
    }

    if (newStock < 0) {
      alert('⚠️ Le stock ne peut pas être négatif !');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3005/stocks/${selectedItem.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quantity: newStock }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Stock mis à jour :', data);
        setMAJ(false);
      } else {
        const error = await response.json();
        console.error('❌ Erreur API :', error);
      }
    } catch (err) {
      console.error('❌ Erreur réseau :', err);
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowAddStocks(true);
  };

  const handleDelete = async (itemId) => {
    try {
      const response = await fetch(
        `http://localhost:3005/equipements/${itemId}`,
        {
          method: 'DELETE',
        }
      );
      if (response.ok) {
        console.log('Commentaire correctement supprimé');
        setStockItem((prev) => prev.filter((f) => f.id !== itemId));
      } else {
        console.error('Échec de la suppression');
      }
    } catch (err) {
      console.error('Erreur lors de la suppression :', err);
    }
  };

  const filteredItems = stockItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.storageLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 ">
      {showAddStocks && (
        <AgriculturalInventoryPage
          showAddStocks={showAddStocks}
          setShowAddStocks={setShowAddStocks}
          selectedItem={selectedItem}
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const stockLevel = getStockLevel(item.quantity, item.alertStock);
          const expirationStatus = getExpirationStatus(item.expirationDate);

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              {/* En-tête de carte */}
              <div className="p-4 border-b border-gray-100 bg-gray-50">
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
                      onClick={() => handleDelete(item.id)}
                      className="p-1 text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Corps de carte */}
              <div className="p-4 space-y-3">
                {/* Quantité et niveau de stock */}
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-gray-800">
                    {item.quantity}{' '}
                    <span className="text-sm font-normal text-gray-500">
                      {item.unit}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getStockLevelColor(
                      stockLevel
                    )}`}
                  >
                    {getStockLevelText(stockLevel)}
                  </span>
                </div>

                {/* Seuil d'alerte */}
                <div className="flex items-center text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                  <AlertTriangle className="w-3 h-3 mr-2" />
                  <span>
                    Seuil d'alerte: {item.alertStock} {item.unit}
                  </span>
                </div>

                {/* Stockage et lot */}
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="truncate">{item.storageLocation}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Package className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="truncate">Lot: {item.batchNumber}</span>
                </div>

                {/* Fournisseur */}
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-4 h-4 mr-2 text-gray-400 flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                  <span className="truncate">{item.supplier}</span>
                </div>

                {/* Prix d'achat */}
                <div className="flex items-center text-sm">
                  <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="font-medium text-green-600">
                    {item.purchasePrice.toLocaleString()}€
                  </span>
                  <span className="text-gray-500 ml-1">
                    ({(item.purchasePrice / item.quantity).toFixed(2)}€/
                    {item.unit})
                  </span>
                </div>

                {/* Statut d'expiration */}
                {item.expirationDate && (
                  <div
                    className={`flex items-center text-sm p-2 rounded-lg ${getExpirationColor(
                      expirationStatus
                    )}`}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                      {expirationStatus === 'expired'
                        ? `EXPIRÉ le ${new Date(
                            item.expirationDate
                          ).toLocaleDateString('fr-FR')}`
                        : expirationStatus === 'expiring'
                        ? `Expire le ${new Date(
                            item.expirationDate
                          ).toLocaleDateString('fr-FR')}`
                        : `Expire le ${new Date(
                            item.expirationDate
                          ).toLocaleDateString('fr-FR')}`}
                    </span>
                    {expirationStatus === 'expired' && (
                      <AlertTriangle className="w-4 h-4 ml-auto text-red-500" />
                    )}
                    {expirationStatus === 'expiring' && (
                      <AlertTriangle className="w-4 h-4 ml-auto text-orange-500" />
                    )}
                  </div>
                )}

                {/* Notes */}
                {item.notes && (
                  <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded-lg border border-blue-100">
                    <span className="font-medium">Note:</span> {item.notes}
                  </div>
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
                  <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            Mettre à jour le stock
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
                      {/* Stock actuel */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600 mb-1">
                          Stock actuel
                        </div>
                        <div className="text-2xl font-bold text-gray-800">
                          {selectedItem.quantity}{' '}
                          <span className="text-sm font-normal text-gray-500">
                            {selectedItem.unit}
                          </span>
                        </div>
                      </div>

                      {/* Type de mise à jour */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Comment souhaitez-vous mettre à jour le stock ?
                        </label>
                        <div className="space-y-3">
                          {/* Option "Stock restant" */}
                          <div>
                            <input
                              type="radio"
                              id="remaining"
                              name="updateType"
                              value="remaining"
                              checked={updateType === 'remaining'}
                              onChange={(e) => setUpdateType(e.target.value)}
                              className="sr-only peer"
                            />
                            <label
                              htmlFor="remaining"
                              className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors peer-checked:border-blue-500 peer-checked:ring-2 peer-checked:ring-blue-200"
                            >
                              <div className="ml-1 flex items-center space-x-3">
                                <Calculator className="w-5 h-5 text-green-600" />
                                <div>
                                  <div className="text-sm font-medium text-gray-800">
                                    Stock restant
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Indiquer la quantité totale restante
                                  </div>
                                </div>
                              </div>
                            </label>
                          </div>

                          {/* Option "Quantité utilisée" */}
                          <div>
                            <input
                              type="radio"
                              id="used"
                              name="updateType"
                              value="used"
                              checked={updateType === 'used'}
                              onChange={(e) => setUpdateType(e.target.value)}
                              className="sr-only peer"
                            />
                            <label
                              htmlFor="used"
                              className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors peer-checked:border-orange-500 peer-checked:ring-2 peer-checked:ring-orange-200"
                            >
                              <div className="ml-1 flex items-center space-x-3">
                                <Minus className="w-5 h-5 text-orange-600" />
                                <div>
                                  <div className="text-sm font-medium text-gray-800">
                                    Quantité utilisée
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Déduire du stock actuel
                                  </div>
                                </div>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Saisie de quantité */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {updateType === 'remaining'
                            ? 'Quantité restante'
                            : 'Quantité utilisée'}
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={currentStock}
                            onChange={(e) => setCurrentStock(e.target.value)}
                            placeholder="0"
                            min="0"
                            step="0.01"
                            className="text-gray-700 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-gray-500 text-sm">
                              {selectedItem.unit}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Aperçu du nouveau stock */}
                      {!isNaN(parseFloat(selectedItem.quantity)) &&
                        !isNaN(parseFloat(currentStock)) &&
                        selectedItem.quantity !== '' && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="text-sm text-blue-700 mb-1">
                              Nouveau stock après mise à jour
                            </div>
                            <div className="text-xl font-bold text-blue-800">
                              {updateType === 'remaining'
                                ? parseFloat(currentStock).toLocaleString()
                                : (
                                    parseFloat(selectedItem.quantity) -
                                    parseFloat(currentStock)
                                  ).toLocaleString()}{' '}
                              <span className="text-sm font-normal">
                                {selectedItem.unit}
                              </span>
                            </div>
                            {updateType === 'used' &&
                              parseFloat(selectedItem.quantity) -
                                parseFloat(currentStock) <
                                0 && (
                                <div className="text-xs text-red-600 mt-1">
                                  ⚠️ Attention : Stock négatif
                                </div>
                              )}
                          </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex space-x-3 p-6 border-t border-gray-200">
                      <button
                        onClick={() => setMAJ(false)}
                        className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={() =>
                          handleSave(
                            updateType,
                            selectedItem.quantity,
                            currentStock,
                            selectedItem.id
                          )
                        }
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Sauvegarder
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
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Aucun produit trouvé
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
                  stockItems.filter(
                    (item) =>
                      getStockLevel(item.quantity, item.alertStock) === 'good'
                  ).length
                }
              </p>
              <p className="text-sm text-gray-500">Stock suffisant</p>
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
                  stockItems.filter(
                    (item) =>
                      getStockLevel(item.quantity, item.alertStock) === 'low'
                  ).length
                }
              </p>
              <p className="text-sm text-gray-500">Stock faible</p>
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
                  stockItems.filter(
                    (item) =>
                      getStockLevel(item.quantity, item.alertStock) ===
                      'critical'
                  ).length
                }
              </p>
              <p className="text-sm text-gray-500">Stock critique</p>
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
                  stockItems.filter(
                    (item) =>
                      item.expirationDate &&
                      getExpirationStatus(item.expirationDate) === 'expiring'
                  ).length
                }
              </p>
              <p className="text-sm text-gray-500">Expire bientôt</p>
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
                  stockItems.filter(
                    (item) =>
                      item.expirationDate &&
                      getExpirationStatus(item.expirationDate) === 'expired'
                  ).length
                }
              </p>
              <p className="text-sm text-gray-500">Expiré</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryDisplayPage;
