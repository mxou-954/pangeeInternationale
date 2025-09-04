import React from 'react';
import {
  X,
  MapPin,
  Ruler,
  Droplets,
  AlertTriangle,
  Activity,
  Wheat,
  CreativeCommons,
} from 'lucide-react';

interface FieldDetailsModalProps {
  field;
  isOpen: boolean;
  onClose: () => void;
}

const FieldDetailsModal: React.FC<FieldDetailsModalProps> = ({
  field,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const formatOwnershipType = (type: string) => {
    switch (type) {
      case 'propriete':
        return 'Propriété';
      case 'location':
        return 'Location';
      default:
        return type;
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'planning':
        return 'En planification';
      case 'active':
        return 'Actif';
      case 'completed':
        return 'Terminé';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const harvests = Array.isArray(field.harvest) ? field.harvest : [];
  const ongoing = harvests.filter((h) => !h.isEnd);
  const closed = harvests.filter((h) => h.isEnd);

  return (
    <div className="fixed inset-0 bg-opacity-100 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{field.name}</h2>
              <div className="flex items-center gap-2 mt-2 text-green-100">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{field.address}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Informations générales */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Informations générales
                </h3>
                <p className="text-sm text-gray-500">
                  Caractéristiques principales du champ
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Superficie */}
              <div className="bg-white border border-blue-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Ruler className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                      Superficie
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    {field.size}
                  </p>
                  <p className="text-sm text-gray-500 font-medium">hectares</p>
                </div>
              </div>

              {/* Statut */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gray-100 rounded-xl">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Statut
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <span
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                      field.status
                    )}`}
                  >
                    <div className="w-2 h-2 bg-current rounded-full mr-2"></div>
                    {formatStatus(field.status)}
                  </span>
                </div>
              </div>

              {/* Propriété */}
              <div className="bg-white border border-green-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 6a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-green-600 uppercase tracking-wide">
                      Propriété
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">
                    {formatOwnershipType(field.ownershipType)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sol et irrigation */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-amber-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Caractéristiques techniques
                </h3>
                <p className="text-sm text-gray-500">
                  Informations sur le sol et l'irrigation
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Section Sol */}
              <div className="bg-white border border-amber-200 rounded-xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 border-b border-amber-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500 rounded-lg shadow-sm">
                      <div className="w-5 h-5 bg-white rounded-sm"></div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        Caractéristiques du sol
                      </h4>
                      <p className="text-sm text-amber-700">
                        Composition et propriétés
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-amber-50 rounded-lg p-4">
                      <p className="text-xs font-medium text-amber-700 uppercase tracking-wide mb-1">
                        Type
                      </p>
                      <p className="font-semibold text-gray-900 capitalize">
                        {field.soilType}
                      </p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-4">
                      <p className="text-xs font-medium text-amber-700 uppercase tracking-wide mb-1">
                        Qualité
                      </p>
                      <p className="font-semibold text-gray-900 capitalize">
                        {field.soilQuality}
                      </p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-4">
                      <p className="text-xs font-medium text-amber-700 uppercase tracking-wide mb-1">
                        pH
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">
                          {field.soilPH}
                        </p>
                        <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                      </div>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-4">
                      <p className="text-xs font-medium text-amber-700 uppercase tracking-wide mb-1">
                        Drainage
                      </p>
                      <p className="font-semibold text-gray-900 capitalize">
                        {field.drainage}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-amber-700 uppercase tracking-wide">
                          Exposition
                        </p>
                        <p className="font-semibold text-gray-900 capitalize">
                          {field.exposition}
                        </p>
                      </div>
                      <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-amber-700"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Irrigation */}
              <div className="bg-white border border-blue-200 rounded-xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 border-b border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
                      <Droplets className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        Système d'irrigation
                      </h4>
                      <p className="text-sm text-blue-700">Gestion de l'eau</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-blue-700 uppercase tracking-wide mb-1">
                            Système
                          </p>
                          <p className="font-semibold text-gray-900 capitalize">
                            {field.irrigationSystem}
                          </p>
                        </div>
                        <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-blue-700"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-blue-700 uppercase tracking-wide mb-1">
                            Capacité
                          </p>
                          <p className="font-semibold text-gray-900">
                            {field.irrigationCapacity} L
                          </p>
                        </div>
                        <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-blue-700"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-blue-700 uppercase tracking-wide mb-1">
                            Source
                          </p>
                          <p className="font-semibold text-gray-900 capitalize">
                            {field.waterSource}
                          </p>
                        </div>
                        <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-blue-700"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-blue-700 uppercase tracking-wide">
                          Accessibilité
                        </p>
                        <p className="font-semibold text-gray-900 capitalize">
                          {field.accessibility}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                        <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Certifications et risques */}
          {/* Certifications et Risques */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* Certifications */}
            {field.certifications && field.certifications.length > 0 && (
              <div className="bg-white border border-green-200 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-green-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500 rounded-lg shadow-sm">
                      <CreativeCommons className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Certifications
                      </h3>
                      <p className="text-sm text-green-600">
                        {field.certifications.length} certification
                        {field.certifications.length > 1 ? 's' : ''} active
                        {field.certifications.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 gap-3">
                    {field.certifications.map((cert, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4  transition-colors duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="font-medium text-gray-900">
                            {cert}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                            <svg
                              className="w-3 h-3 text-green-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Risques climatiques */}
            {field.climateRisks && field.climateRisks.length > 0 && (
              <div className="bg-white border border-red-200 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 border-b border-red-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500 rounded-lg shadow-sm">
                      <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Risques climatiques
                      </h3>
                      <p className="text-sm text-red-600">
                        {field.climateRisks.length} risque
                        {field.climateRisks.length > 1 ? 's' : ''} identifié
                        {field.climateRisks.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 gap-3">
                    {field.climateRisks.map((risk, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg p-4 transition-colors duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="font-medium text-gray-900">
                            {risk}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-3 h-3 text-red-600" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Activités récentes */}
          {field.activities && field.activities.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Activity className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Activités récentes
                    </h3>
                    <p className="text-sm text-gray-500">
                      {field.activities.length > 3
                        ? `${
                            field.activities.slice(0, 3).length
                          } activités récentes sur ${
                            field.activities.length
                          } au total`
                        : `${field.activities.length} activité${
                            field.activities.length > 1 ? 's' : ''
                          }`}
                    </p>
                  </div>
                </div>

                {field.activities.length > 3 && (
                  <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                    Voir toutes ({field.activities.length})
                  </button>
                )}
              </div>

              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                {field.activities.slice(0, 3).map((activity, index) => (
                  <div
                    key={activity.id}
                    className={`p-6  transition-colors duration-200 ${
                      index !== field.activities.slice(0, 3).length - 1
                        ? 'border-b border-gray-100'
                        : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        {/* Icône d'activité */}
                        <div className="p-2 bg-purple-50 rounded-lg mt-1">
                          {activity.activityType === 'pesticides' && (
                            <svg
                              className="w-4 h-4 text-purple-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                            </svg>
                          )}
                          {activity.activityType === 'irrigation' && (
                            <svg
                              className="w-4 h-4 text-purple-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path
                                fillRule="evenodd"
                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                          {!['pesticides', 'irrigation'].includes(
                            activity.activityType
                          ) && <Activity className="w-4 h-4 text-purple-600" />}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900 capitalize">
                              {activity.activityType}
                            </h4>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                activity.status
                              )}`}
                            >
                              {formatStatus(activity.status)}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {new Date(activity.date).toLocaleDateString(
                                'fr-FR',
                                {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                }
                              )}
                            </div>

                            {activity.startTime && activity.endTime && (
                              <div className="flex items-center gap-1">
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                {activity.startTime.slice(0, 5)} -{' '}
                                {activity.endTime.slice(0, 5)}
                              </div>
                            )}
                          </div>

                          {activity.notes && activity.notes.trim() && (
                            <p className="text-sm text-gray-600 mt-2 bg-gray-50 rounded-lg p-2">
                              {activity.notes.length > 100
                                ? `${activity.notes.slice(0, 100)}...`
                                : activity.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Quantité et opérateur */}
                      <div className="text-right ml-4">
                        <div className="bg-purple-50 rounded-lg px-3 py-2 mb-2">
                          <p className="text-sm font-semibold text-purple-900">
                            {activity.quantity} {activity.unit}
                          </p>
                        </div>

                        {activity.operator && (
                          <p className="text-xs text-gray-500">
                            Par {activity.operator.firstName}{' '}
                            {activity.operator.lastName}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {field.activities.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">Aucune activité récente</p>
                    <p className="text-sm">
                      Les activités apparaîtront ici une fois enregistrées
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Récoltes */}
          {/* Plantations en cours */}
          {ongoing.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Wheat className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Plantations en cours
                  </h3>
                  <p className="text-sm text-gray-500">
                    {ongoing.length} plantation{ongoing.length > 1 ? 's' : ''}{' '}
                    active{ongoing.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {ongoing.map((harvest) => (
                  <div
                    key={harvest.id}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    {/* Header avec culture et variété */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 capitalize mb-1">
                          {harvest.cropType}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Variété: {harvest.variety}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-green-600">
                          En cours
                        </span>
                      </div>
                    </div>

                    {/* Timeline des dates */}
                    <div className="relative mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mb-2"></div>
                          <div className="text-center">
                            <p className="text-xs font-medium text-gray-900">
                              Plantation
                            </p>
                            <p className="text-xs text-gray-600">
                              {harvest.plantingDate
                                ? new Date(
                                    harvest.plantingDate
                                  ).toLocaleDateString('fr-FR', {
                                    day: '2-digit',
                                    month: 'short',
                                  })
                                : '—'}
                            </p>
                          </div>
                        </div>

                        <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-500 to-yellow-500 mx-4"></div>

                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full mb-2"></div>
                          <div className="text-center">
                            <p className="text-xs font-medium text-gray-900">
                              Récolte prévue
                            </p>
                            <p className="text-xs text-gray-600">
                              {harvest.harvestDate
                                ? new Date(
                                    harvest.harvestDate
                                  ).toLocaleDateString('fr-FR', {
                                    day: '2-digit',
                                    month: 'short',
                                  })
                                : '—'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Badge qualité */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                        Qualité: {harvest.harvestQuality || 'À évaluer'}
                      </span>

                      {/* Durée estimée */}
                      {harvest.plantingDate && harvest.harvestDate && (
                        <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                          {Math.ceil(
                            (new Date(harvest.harvestDate).getTime() -
                              new Date(harvest.plantingDate).getTime()) /
                              (1000 * 60 * 60 * 24)
                          )}{' '}
                          jours
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Récoltes clôturées */}
          {closed.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Wheat className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Récoltes clôturées
                  </h3>
                  <p className="text-sm text-gray-500">
                    {closed.length} récolte{closed.length > 1 ? 's' : ''}{' '}
                    terminée{closed.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {closed.map((harvest) => (
                  <div
                    key={harvest.id}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 relative overflow-hidden"
                  >
                    {/* Badge clôturé en coin */}
                    <div className="absolute top-0 right-0 bg-gray-500 text-white px-3 py-1 text-xs font-medium rounded-bl-lg">
                      Clôturée
                    </div>

                    {/* Header avec culture et variété */}
                    <div className="flex items-start justify-between mb-4 pr-16">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 capitalize mb-1">
                          {harvest.cropType}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Variété: {harvest.variety}
                        </p>
                      </div>
                    </div>

                    {/* Informations en grille */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                          Plantation
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {harvest.plantingDate
                            ? new Date(harvest.plantingDate).toLocaleDateString(
                                'fr-FR',
                                {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                }
                              )
                            : '—'}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                          Clôturée le
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {harvest.closedAt
                            ? new Date(harvest.closedAt).toLocaleDateString(
                                'fr-FR',
                                {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                }
                              )
                            : '—'}
                        </p>
                      </div>
                    </div>

                    {/* Résultats */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        <div className="w-2 h-2 bg-slate-400 rounded-full mr-2"></div>
                        Qualité: {harvest.harvestQuality || 'Non évaluée'}
                      </span>

                      {/* Rendement si disponible */}
                      {harvest.yieldTonnes && harvest.yieldTonnes > 0 && (
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Rendement</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {harvest.yieldTonnes}t
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Durée totale */}
                    {harvest.plantingDate && harvest.closedAt && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Durée totale</span>
                          <span className="font-medium text-gray-700">
                            {Math.ceil(
                              (new Date(harvest.closedAt).getTime() -
                                new Date(harvest.plantingDate).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )}{' '}
                            jours
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Agriculteur */}
          {/* Agriculteur responsable */}
          {field.farmer && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Agriculteur responsable
                  </h3>
                  <p className="text-sm text-gray-500">
                    Gestionnaire principal du champ
                  </p>
                </div>
              </div>

              <div className="bg-white border border-green-200 rounded-xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-green-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-2xl font-bold text-white">
                          {field.farmer.firstName?.[0]}
                          {field.farmer.lastName?.[0]}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">
                          {field.farmer.firstName} {field.farmer.lastName}
                        </h4>
                        <p className="text-sm text-green-600 font-medium">
                          Agriculteur certifié
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                        Actif
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contact Email */}
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <svg
                          className="w-4 h-4 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Email
                        </p>
                        <p className="font-medium text-gray-900">
                          {field.farmer.email}
                        </p>
                      </div>
                    </div>

                    {/* Téléphone (si disponible) */}
                    {field.farmer.phone && (
                      <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <svg
                            className="w-4 h-4 text-green-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Téléphone
                          </p>
                          <p className="font-medium text-gray-900">
                            {field.farmer.phone}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Genre (si disponible) */}
                    {field.farmer.gender && (
                      <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <svg
                            className="w-4 h-4 text-purple-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Genre
                          </p>
                          <p className="font-medium text-gray-900 capitalize">
                            {field.farmer.gender}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Âge (si date de naissance disponible) */}
                    {field.farmer.dateOfBirth && (
                      <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <svg
                            className="w-4 h-4 text-orange-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Âge
                          </p>
                          <p className="font-medium text-gray-900">
                            {new Date().getFullYear() -
                              new Date(
                                field.farmer.dateOfBirth
                              ).getFullYear()}{' '}
                            ans
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Statistiques supplémentaires */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                        <div className="flex items-center justify-center mb-2">
                          <svg
                            className="w-5 h-5 text-green-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Expérience
                        </p>
                        <p className="font-semibold text-gray-900">Certifié</p>
                      </div>

                      <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                        <div className="flex items-center justify-center mb-2">
                          <svg
                            className="w-5 h-5 text-blue-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Champs
                        </p>
                        <p className="font-semibold text-gray-900">
                          Responsable
                        </p>
                      </div>

                      <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg">
                        <div className="flex items-center justify-center mb-2">
                          <svg
                            className="w-5 h-5 text-yellow-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Statut
                        </p>
                        <p className="font-semibold text-gray-900">Actif</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FieldDetailsModal;
