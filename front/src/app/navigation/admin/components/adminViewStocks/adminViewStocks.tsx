'use client';

import React, { useState } from 'react';
import {
  Package,
  AlertTriangle,
  Calendar,
  MapPin,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Truck,
  Archive,
  Eye,
} from 'lucide-react';

const getStockStatusConfig = (stock) => {
  const quantity = Number(stock?.quantity) || 0;
  const alertLevel = Number(stock?.alertStock) || 0;
  const expiration = stock?.expirationDate ? new Date(stock.expirationDate) : null;
  const today = new Date();
  const daysUntilExpiry = expiration ? Math.ceil((expiration - today) / (1000 * 60 * 60 * 24)) : null;

  // Priorité : Expiré > Stock critique > Expiration proche > Normal
  if (daysUntilExpiry !== null && daysUntilExpiry <= 0) {
    return {
      status: 'expired',
      color: 'text-red-700 bg-red-50 border-red-200',
      icon: AlertTriangle,
      label: 'Expiré',
      dot: 'bg-red-500',
      priority: 1
    };
  }
  if (quantity <= alertLevel) {
    return {
      status: 'critical',
      color: 'text-orange-700 bg-orange-50 border-orange-200',
      icon: TrendingDown,
      label: 'Stock critique',
      dot: 'bg-orange-500',
      priority: 2
    };
  }
  if (daysUntilExpiry !== null && daysUntilExpiry <= 30) {
    return {
      status: 'expiring',
      color: 'text-yellow-700 bg-yellow-50 border-yellow-200',
      icon: Clock,
      label: 'Expire bientôt',
      dot: 'bg-yellow-500',
      priority: 3
    };
  }
  return {
    status: 'normal',
    color: 'text-green-700 bg-green-50 border-green-200',
    icon: CheckCircle,
    label: 'Normal',
    dot: 'bg-green-500',
    priority: 4
  };
};

const getCategoryConfig = (category) => {
  switch (category?.toLowerCase()) {
    case 'semences':
      return { icon: '🌱', color: 'text-green-600', bg: 'bg-green-100' };
    case 'pesticides':
      return { icon: '🧪', color: 'text-red-600', bg: 'bg-red-100' };
    case 'engrais':
      return { icon: '🌿', color: 'text-blue-600', bg: 'bg-blue-100' };
    case 'outils':
      return { icon: '🔧', color: 'text-gray-600', bg: 'bg-gray-100' };
    default:
      return { icon: '📦', color: 'text-purple-600', bg: 'bg-purple-100' };
  }
};

export default function AdminStocksPanel({ stocks = [] }) {
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [showStockDetails, setShowStockDetails] = useState(new Set());

  const items = Array.isArray(stocks) ? stocks : [];

  // Grouper par catégorie
  const stocksByCategory = items.reduce((acc, stock) => {
    const category = stock?.category || 'Autres';
    if (!acc[category]) acc[category] = [];
    acc[category].push(stock);
    return acc;
  }, {});

  // Trier les stocks dans chaque catégorie par priorité (statut critique d'abord)
  Object.keys(stocksByCategory).forEach(category => {
    stocksByCategory[category].sort((a, b) => {
      const statusA = getStockStatusConfig(a);
      const statusB = getStockStatusConfig(b);
      return statusA.priority - statusB.priority;
    });
  });

  // Stats globales
  const totalItems = items.length;
  const totalValue = items.reduce((acc, stock) => acc + (Number(stock?.purchasePrice) || 0) * (Number(stock?.quantity) || 0), 0);
  const criticalStocks = items.filter(stock => getStockStatusConfig(stock).status === 'critical').length;
  const expiredStocks = items.filter(stock => getStockStatusConfig(stock).status === 'expired').length;
  const expiringStocks = items.filter(stock => getStockStatusConfig(stock).status === 'expiring').length;

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const d = new Date(dateString);
    return isNaN(+d)
      ? '—'
      : d.toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'short',
        });
  };

  const getDaysUntilExpiry = (expirationDate) => {
    if (!expirationDate) return null;
    const today = new Date();
    const expiry = new Date(expirationDate);
    if (isNaN(+expiry)) return null;
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const toggleExpandCategory = (category) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleShowStockDetails = (stockId) => {
    const newShowDetails = new Set(showStockDetails);
    if (newShowDetails.has(stockId)) {
      newShowDetails.delete(stockId);
    } else {
      newShowDetails.add(stockId);
    }
    setShowStockDetails(newShowDetails);
  };

  return (
    <div className="bg-white">
      {/* Header avec métriques visuelles */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900">📦 Gestion des Stocks</h2>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Inventaire temps réel</span>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{totalItems}</div>
            <div className="text-xs text-gray-500">Produits</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{criticalStocks + expiredStocks}</div>
            <div className="text-xs text-gray-500">Alertes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{expiringStocks}</div>
            <div className="text-xs text-gray-500">Expirent bientôt</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{totalValue.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Valeur totale</div>
          </div>
        </div>
      </div>

      {/* Liste par catégories */}
      <div className="divide-y divide-gray-100">
        {Object.keys(stocksByCategory).length > 0 ? (
          Object.entries(stocksByCategory).map(([category, categoryStocks]) => {
            const isExpanded = expandedCategories.has(category);
            const categoryConfig = getCategoryConfig(category);
            const alertCount = categoryStocks.filter(stock => 
              ['critical', 'expired', 'expiring'].includes(getStockStatusConfig(stock).status)
            ).length;

            return (
              <div key={category} className="hover:bg-gray-50 transition-colors">
                {/* Ligne de catégorie */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <button
                        onClick={() => toggleExpandCategory(category)}
                        className="flex-shrink-0 p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-500" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{categoryConfig.icon}</span>
                            <h3 className="font-semibold text-gray-900 text-base capitalize">
                              {category}
                            </h3>
                          </div>
                          {alertCount > 0 && (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-red-100 text-red-700 border border-red-200">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {alertCount} alerte{alertCount > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm">
                          <div className="flex items-center space-x-1">
                            <Package className="h-4 w-4 text-blue-600" />
                            <span className="font-bold text-blue-600">{categoryStocks.length}</span>
                            <span className="text-gray-500">produit{categoryStocks.length > 1 ? 's' : ''}</span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span className="font-bold text-green-600">
                              {categoryStocks.reduce((acc, stock) => acc + (Number(stock?.purchasePrice) || 0) * (Number(stock?.quantity) || 0), 0).toLocaleString()}
                            </span>
                            <span className="text-gray-500">valeur</span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <Archive className="h-4 w-4 text-purple-600" />
                            <span className="font-bold text-purple-600">
                              {new Set(categoryStocks.map(s => s?.storageLocation).filter(Boolean)).size}
                            </span>
                            <span className="text-gray-500">entrepôt{new Set(categoryStocks.map(s => s?.storageLocation).filter(Boolean)).size > 1 ? 's' : ''}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
                        <MoreHorizontal className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stocks de cette catégorie */}
                {isExpanded && (
                  <div className="px-4 pb-4 bg-gradient-to-b from-gray-50 to-white border-t border-gray-100">
                    <div className="pt-4 space-y-3">
                      {categoryStocks.map((stock) => {
                        const statusConfig = getStockStatusConfig(stock);
                        const daysUntilExpiry = getDaysUntilExpiry(stock?.expirationDate);
                        const showDetails = showStockDetails.has(stock.id);
                        
                        return (
                          <div key={stock.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            {/* Ligne principale du stock */}
                            <div className="p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 flex-1 min-w-0">
                                  <div className={`w-3 h-3 rounded-full ${statusConfig.dot} flex-shrink-0`}></div>
                                  
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-3 mb-1">
                                      <h4 className="font-semibold text-gray-900 truncate">
                                        {stock.name || 'Sans nom'}
                                      </h4>
                                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border ${statusConfig.color}`}>
                                        <statusConfig.icon className="h-3 w-3 mr-1" />
                                        {statusConfig.label}
                                      </span>
                                      {stock.subcategory && (
                                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md">
                                          {stock.subcategory}
                                        </span>
                                      )}
                                    </div>
                                    
                                    <div className="flex items-center space-x-4 text-sm">
                                      <div className="flex items-center space-x-1">
                                        <Package className="h-3 w-3 text-gray-500" />
                                        <span className="font-bold text-gray-900">{Number(stock?.quantity) || 0}</span>
                                        <span className="text-gray-500">{stock?.unit || 'unités'}</span>
                                      </div>
                                      
                                      {stock?.storageLocation && (
                                        <div className="flex items-center space-x-1">
                                          <MapPin className="h-3 w-3 text-gray-500" />
                                          <span className="text-gray-600 truncate max-w-32">
                                            {stock.storageLocation}
                                          </span>
                                        </div>
                                      )}
                                      
                                      {daysUntilExpiry !== null && (
                                        <div className="flex items-center space-x-1">
                                          <Calendar className="h-3 w-3 text-gray-500" />
                                          <span className={`font-medium ${
                                            daysUntilExpiry <= 0 ? 'text-red-600' :
                                            daysUntilExpiry <= 30 ? 'text-yellow-600' : 'text-gray-600'
                                          }`}>
                                            {daysUntilExpiry <= 0 ? 'Expiré' : `${daysUntilExpiry}j`}
                                          </span>
                                        </div>
                                      )}

                                      {stock?.purchasePrice && (
                                        <div className="flex items-center space-x-1">
                                          <DollarSign className="h-3 w-3 text-green-600" />
                                          <span className="font-bold text-green-600">
                                            {(Number(stock.purchasePrice) * Number(stock?.quantity || 0)).toLocaleString()}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-2 flex-shrink-0">
                                  <button
                                    onClick={() => toggleShowStockDetails(stock.id)}
                                    className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-md transition-colors"
                                  >
                                    <Eye className="h-3 w-3" />
                                    {showDetails ? (
                                      <ChevronDown className="h-3 w-3" />
                                    ) : (
                                      <ChevronRight className="h-3 w-3" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Détails du stock */}
                            {showDetails && (
                              <div className="px-3 pb-3 bg-gray-50 border-t border-gray-100">
                                <div className="pt-3 grid grid-cols-2 gap-4">
                                  <div className="space-y-3">
                                    <div className="bg-white p-3 rounded border">
                                      <div className="text-xs text-gray-500 mb-1">📦 Informations produit</div>
                                      <div className="space-y-1">
                                        {stock?.batchNumber && (
                                          <div className="text-xs">
                                            <span className="text-gray-500">Lot: </span>
                                            <span className="font-medium">{stock.batchNumber}</span>
                                          </div>
                                        )}
                                        {stock?.supplier && (
                                          <div className="text-xs">
                                            <span className="text-gray-500">Fournisseur: </span>
                                            <span className="font-medium">{stock.supplier}</span>
                                          </div>
                                        )}
                                        <div className="text-xs">
                                          <span className="text-gray-500">Seuil alerte: </span>
                                          <span className="font-medium text-orange-600">{stock?.alertStock || 0} {stock?.unit}</span>
                                        </div>
                                      </div>
                                    </div>

                                    {stock?.notes && (
                                      <div className="bg-white p-3 rounded border">
                                        <div className="text-xs text-gray-500 mb-1">📝 Notes</div>
                                        <div className="text-xs text-gray-700">
                                          {stock.notes}
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  <div className="space-y-3">
                                    <div className="bg-white p-3 rounded border">
                                      <div className="text-xs text-gray-500 mb-1">📅 Dates importantes</div>
                                      <div className="space-y-1">
                                        <div className="text-xs">
                                          <span className="text-gray-500">Achat: </span>
                                          <span className="font-medium">{formatDate(stock?.purchaseDate)}</span>
                                        </div>
                                        <div className="text-xs">
                                          <span className="text-gray-500">Expiration: </span>
                                          <span className={`font-medium ${
                                            daysUntilExpiry <= 0 ? 'text-red-600' :
                                            daysUntilExpiry <= 30 ? 'text-yellow-600' : 'text-gray-900'
                                          }`}>
                                            {formatDate(stock?.expirationDate)}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="bg-white p-3 rounded border">
                                      <div className="text-xs text-gray-500 mb-1">💰 Valeur</div>
                                      <div className="space-y-1">
                                        <div className="text-xs">
                                          <span className="text-gray-500">Prix unitaire: </span>
                                          <span className="font-medium">{Number(stock?.purchasePrice || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="text-xs">
                                          <span className="text-gray-500">Valeur totale: </span>
                                          <span className="font-bold text-green-600">
                                            {(Number(stock?.purchasePrice || 0) * Number(stock?.quantity || 0)).toLocaleString()}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-gray-50">
            <div className="bg-white p-8 rounded-lg mx-4 border-2 border-dashed border-gray-300">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-semibold text-gray-500 mb-2">
                Aucun stock disponible
              </p>
              <p className="text-sm text-gray-400">
                Les produits apparaîtront ici une fois ajoutés
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}