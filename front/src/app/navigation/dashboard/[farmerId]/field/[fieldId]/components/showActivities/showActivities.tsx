'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Plus, Edit, Trash2, Cloud, Download } from 'lucide-react';
import AgriculturalActivityModal from '../addActivities/addActivities';
import {
  deleteActivity,
  getAllActivities,
} from '../../../../../../../../../api/activities';

export default function RenderActivities() {
  const params = useParams();
  const farmerId = String(params.farmerId);
  const fieldId = String(params.fieldId);

  const [activities, setActivities] = useState([]);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [flattenedActivity, setFlattenedActivity] = useState();

  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        const data = await getAllActivities({ signal: ac.signal });
        if (ac.signal.aborted) return;
        setActivities(data as any[]);
        console.log('Activités :', data);
      } catch (err) {
        if (!ac.signal.aborted) {
          console.error('Erreur fetch activités:', err);
        }
      }
    })();

    return () => ac.abort();
  }, [farmerId]);

  useEffect(() => {
    console.log('Activités :', activities);
  }, [activities]);

  const handleEdit = (activity) => {
    const flattenedActivity = {
      ...activity,
      field: activity.field?.id,
      plantation: activity.plantation?.id,
      stock: activity.stock?.id,
      operator: activity.operator?.id,
    };

    setFlattenedActivity(flattenedActivity);
    setShowAddActivity(true);
  };

  const handleUpdate = (data) => {
    setActivities((prev) => {
      const ix = prev.findIndex((f) => f.id === data.id);
      if (ix === -1) return [data, ...prev]; // ✅ ajout
      const next = prev.slice();
      next[ix] = { ...prev[ix], ...data }; // ✅ édition
      return next;
    });
  };

  const handleDelete = async (activityId: string) => {
    try {
      await deleteActivity(activityId);
      console.log('Activité correctement supprimée');
      setActivities((prev) => prev.filter((f) => f.id !== activityId));
    } catch (err) {
      console.error('Erreur lors de la suppression :', err);
    }
  };

  const ChartContainer = ({ title, subtitle, children, actions = [] }) => (
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      <div className="px-8 py-6 bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b border-gray-100/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {actions.map((action, index) => (
              <button
                key={index}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <action.icon className="w-5 h-5 text-gray-500" />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="p-8">{children}</div>
    </div>
  );

  return (
    <ChartContainer
      title="Les Activitées"
      subtitle="Retrouvez la liste de toutes vos activités sur le champ"
      actions={[{ icon: Cloud }, { icon: Download }]}
    >
      <div className="space-y-6">
        {showAddActivity && (
          <AgriculturalActivityModal
            showAddActivity={showAddActivity}
            setShowAddActivity={setShowAddActivity}
            flattenedActivity={flattenedActivity}
            onSave={handleUpdate}
          />
        )}

        {/* Liste des activités */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Champ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Culture
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Opérateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activities
                  .filter((activity) => activity.field.id === fieldId)
                  .map((activity) => (
                    <tr key={activity.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(activity.date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {(activity.activityType === 'watering' &&
                            '💧 Arrosage') ||
                            (activity.activityType === 'pesticides' &&
                              '🐛 Pesticides') ||
                            (activity.activityType === 'fertilizer' &&
                              '🌱 Engrais') ||
                            (activity.activityType === 'inspection' &&
                              '👁️ Inspection') ||
                            (activity.activityType === 'harvest' &&
                              '🌾 Récolte') ||
                            (activity.activityType === 'sowing' &&
                              '🌰 Semis') ||
                            (activity.activityType === 'pruning' &&
                              '✂️ Taille') ||
                            (activity.activityType === 'treatment' &&
                              '💊 Traitement') ||
                            (activity.activityType === 'soil_prep' &&
                              '🚜 Préparation du sol') ||
                            '❓ Inconnu'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">
                            {activity.field?.name || 'N/A'}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {activity.field?.size
                              ? `${activity.field.size} ha`
                              : ''}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">
                            {activity.plantation?.variety ||
                              activity.plantation?.cropType ||
                              'N/A'}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {activity.plantation?.cropType === 'riz' &&
                              '🌾 Riz'}
                            {activity.plantation?.cropType === 'mais' &&
                              '🌽 Maïs'}
                            {activity.plantation?.cropType === 'millet' &&
                              '🌾 Millet'}
                            {activity.plantation?.cropType === 'sorgho' &&
                              '🌾 Sorgho'}
                            {activity.plantation?.cropType === 'arachide' &&
                              '🥜 Arachide'}
                            {activity.plantation?.cropType === 'coton' &&
                              '🧵 Coton'}
                            {activity.plantation?.cropType === 'igname' &&
                              '🍠 Igname'}
                            {activity.plantation?.cropType === 'manioc' &&
                              '🌱 Manioc'}
                            {activity.plantation?.cropType === 'tomate' &&
                              '🍅 Tomate'}
                            {activity.plantation?.cropType === 'oignon' &&
                              '🧅 Oignon'}
                            {activity.plantation?.cropType === 'autre' &&
                              '🧬 Autre'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {activity.quantity && activity.unit ? (
                          <div>
                            <span className="font-medium">
                              {activity.quantity}
                            </span>
                            <span className="text-gray-500 ml-1">
                              {activity.unit}
                            </span>
                            {activity.stock?.name && (
                              <div className="text-xs text-gray-500">
                                {activity.stock.name}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">
                            {activity.operator?.firstName}{' '}
                            {activity.operator?.lastName}
                          </div>
                          {activity.startTime && activity.endTime && (
                            <div className="text-xs text-gray-500">
                              {activity.startTime} - {activity.endTime}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
          ${
            activity.status === 'completed' ? 'bg-green-100 text-green-800' : ''
          }
          ${
            activity.status === 'planned' ? 'bg-yellow-100 text-yellow-800' : ''
          }
          ${
            activity.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : ''
          }
          ${activity.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
        `}
                        >
                          {activity.status === 'completed' && '✅ Terminée'}
                          {activity.status === 'planned' && '🔄 Planifiée'}
                          {activity.status === 'in_progress' && '⏳ En cours'}
                          {activity.status === 'cancelled' && '❌ Annulée'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                        <div className="truncate" title={activity.notes}>
                          {activity.notes || (
                            <span className="text-gray-400 italic">
                              Aucune note
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(activity)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(activity.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ChartContainer>
  );
}
