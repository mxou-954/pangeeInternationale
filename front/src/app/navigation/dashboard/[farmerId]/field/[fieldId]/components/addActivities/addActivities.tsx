'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

import {
  X,
  Calendar,
  Droplets,
  Bug,
  Leaf,
  Eye,
  Wheat,
  Plus,
  CloudRain,
  Sun,
  Wind,
  Camera,
  FileText,
  DollarSign,
  Clock,
  User,
  MapPin,
  Package,
} from 'lucide-react';
import { getFieldsByFarmer } from '../../../../../../../../../api/field';
import { getMembersByFarmer } from '../../../../../../../../../api/members';
import { getAllStocks } from '../../../../../../../../../api/stocks';
import { getPlantationsByField } from '../../../../../../../../../api/harvests';
import { updateActivity } from '../../../../../../../../../api/activities';
import { createActivityForFarmer } from '../../../../../../../../../api/activities';

const AgriculturalActivityModal = ({
  showAddActivity,
  setShowAddActivity,
  flattenedActivity,
  onSave,
}) => {
  const params = useParams();
  const farmerId = String(params.farmerId);
  const fieldId = String(params.fieldId);
  const [harvests, setHarvests] = useState([]);
  const [fields, setFields] = useState([]);
  const [plantations, setPlantations] = useState([]);
  const [members, setMembers] = useState([]);
  const [stockItems, setStockItem] = useState([]);

  const [selectedField, setSelectedField] = useState();
  const [formData, setFormData] = useState({
    activityType: '',
    field: '',
    plantation: '',
    stock: '',
    quantity: '',
    unit: 'L',
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    operator: '',
    status: 'completed',
    notes: '',
  });

  useEffect(() => {
    if (flattenedActivity) {
      setFormData(flattenedActivity);
    }
  }, [flattenedActivity]);

  // Données simulées - à remplacer par vos vraies données
  const activities = [
    { value: 'watering', label: '💧 Arrosage', icon: Droplets },
    { value: 'pesticides', label: '🐛 Pesticides', icon: Bug },
    { value: 'fertilizer', label: '🌱 Engrais', icon: Leaf },
    { value: 'inspection', label: '👁️ Inspection', icon: Eye },
    { value: 'harvest', label: '🌾 Récolte', icon: Wheat },
    { value: 'sowing', label: '🌰 Semis', icon: Plus },
    { value: 'pruning', label: '✂️ Taille', icon: Plus },
    { value: 'treatment', label: '💊 Traitement', icon: Plus },
    { value: 'soil_prep', label: '🚜 Préparation du sol', icon: Plus },
  ];

  const units = [
    { value: 'litres', label: 'Litres' },
    { value: 'kg', label: 'Kilogrammes' },
    { value: 'g', label: 'Grammes' },
    { value: 'ml', label: 'Millilitres' },
    { value: 'unités', label: 'Unités' },
    { value: 'ha', label: 'Hectares' },
    { value: 'sacs', label: 'Sacs' },
    { value: 'tonnes', label: 'Tonnes' },
  ];

  useEffect(() => {
    if (!farmerId) return;
    const ac = new AbortController();

    (async () => {
      try {
        const [fieldsData, membersData, stocksData] = await Promise.all([
          getFieldsByFarmer(String(farmerId)),
          getMembersByFarmer(String(farmerId)),
          getAllStocks(String(farmerId)),
        ]);

        if (ac.signal.aborted) return;

        // map vers {value,label}
        const formattedFields = (fieldsData as any[]).map((f) => ({
          value: f.id,
          label: f.name,
        }));
        setFields(formattedFields);

        const formattedMembers = (membersData as any[]).map((m) => ({
          value: m.id,
          label: `${m.firstName} ${m.lastName}`,
        }));
        setMembers(formattedMembers);

        setStockItem(stocksData as any[]);
      } catch (err) {
        if (!ac.signal.aborted) console.error('Erreur chargement lists:', err);
      }
    })();

    return () => ac.abort();
  }, [farmerId]);

  useEffect(() => {
    const field = formData.field;
    if (!field) return;
    const ac = new AbortController();

    (async () => {
      try {
        const data = await getPlantationsByField(String(field));
        if (ac.signal.aborted) return;

        const formatted = (data as any[]).map((p) => ({
          value: p.id,
          label: p.cropType || 'Culture inconnue',
        }));
        setPlantations(formatted);
      } catch (err) {
        if (!ac.signal.aborted) console.error('Erreur plantations:', err);
      }
    })();

    return () => ac.abort();
  }, [formData.field]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'field' ? { plantation: '' } : {}), // réinitialise plantation si le champ change
    }));
  };

  const handleSubmit = async () => {
    const isEdit = !!flattenedActivity?.id;

    // construire un payload propre (sans id/timestamps)
    const merged: any = { ...(flattenedActivity ?? {}), ...formData };
    const { id, createdAt, updatedAt, farmer, ...payload } = merged;

    console.log('On envoie :', payload);

    try {
      const data = isEdit
        ? await updateActivity(String(flattenedActivity!.id), payload)
        : await createActivityForFarmer(String(farmerId), payload);

      console.log(isEdit ? 'Activité mise à jour' : 'Activité ajoutée', data);
      onSave?.(data);
    } catch (err) {
      console.error('Erreur API :', err);
    } finally {
      setShowAddActivity(false);
    }
  };

  if (!showAddActivity) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <button
          onClick={() => setShowAddActivity(true)}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg"
        >
          Enregistrer une activité
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-opacity-100 backdrop-blur-md flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 relative">
          <button
            onClick={() => setShowAddActivity(false)}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Leaf className="w-8 h-8" />
            Enregistrer une Activité Agricole
          </h2>
          <p className="text-green-100 mt-1">
            Documentez vos interventions sur les cultures
          </p>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Type d'activité */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Type d'activité *
              </label>
              <select
                name="activityType"
                value={formData.activityType}
                onChange={handleInputChange}
                className="text-gray-500 w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                <option value="">Sélectionnez une activité</option>
                {activities.map((activity) => (
                  <option key={activity.value} value={activity.value}>
                    {activity.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Champ */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                Champ/Parcelle *
              </label>
              <select
                name="field"
                value={formData.field}
                onChange={handleInputChange}
                className="text-gray-500 w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                <option value="">Sélectionnez un champ</option>
                {fields.map((field) => (
                  <option key={field.value} value={field.value}>
                    {field.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Plantation */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Wheat className="inline w-4 h-4 mr-1" />
                Culture/Plantation *
              </label>
              <select
                name="plantation"
                value={formData.plantation}
                onChange={handleInputChange}
                className="text-gray-500 w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                <option value="">Sélectionnez une culture</option>
                {plantations.map((plantation) => (
                  <option key={plantation.value} value={plantation.value}>
                    {plantation.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantité et Unité */}
            <div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Package className="inline w-4 h-4 mr-1" />
                  Stock utilisé *
                </label>
                <select
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="text-gray-500 w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                >
                  <option value="">Sélectionnez un élément de stock</option>
                  {stockItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.quantity} {item.unit})
                    </option>
                  ))}
                </select>
              </div>

              <label className="block text-sm font-semibold text-gray-700 mt-2">
                Quantité utilisée
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="0"
                  step="0.01"
                  className="text-gray-500 mt-2 flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="text-gray-500 mt-2 w-32 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                >
                  {units.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Date de l'activité *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="text-gray-500 w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Horaires */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                Horaires
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="text-gray-500 flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
                <span className="text-gray-500">à</span>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="text-gray-500 flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Opérateur */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-1" />
                Opérateur/Responsable *
              </label>
              <select
                name="operator"
                value={formData.operator}
                onChange={handleInputChange}
                className="text-gray-500 w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                <option value="">Sélectionnez un opérateur</option>
                {members.map((member) => (
                  <option key={member.value} value={member.value}>
                    {member.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Statut */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Statut
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="text-gray-500 w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                <option value="planned">🔄 Planifiée</option>
                <option value="in_progress">⏳ En cours</option>
                <option value="completed">✅ Terminée</option>
                <option value="cancelled">❌ Annulée</option>
              </select>
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FileText className="inline w-4 h-4 mr-1" />
                Notes et observations
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="4"
                placeholder="Ajoutez des notes supplémentaires, observations sur l'état des cultures, problèmes rencontrés, etc."
                className="text-gray-500 w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
            <button
              type="button"
              onClick={() => setShowAddActivity(false)}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg font-medium flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Enregistrer l'activité
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgriculturalActivityModal;
