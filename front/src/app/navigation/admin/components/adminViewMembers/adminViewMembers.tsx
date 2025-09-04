'use client';

import React, { useState } from 'react';
import {
  Users,
  AlertTriangle,
  Calendar,
  MapPin,
  TrendingDown,
  TrendingUp,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  DollarSign,
  Archive,
  Shield,
  Search,
  User,
  Phone,
  Mail,
  Award,
  Briefcase,
} from 'lucide-react';

const getDepartmentConfig = (department) => {
  switch (department?.toLowerCase()) {
    case 'elevage':
      return { icon: '🐄', label: 'Élevage' };
    case 'agriculture':
      return { icon: '🌾', label: 'Agriculture' };
    case 'maintenance':
      return { icon: '🔧', label: 'Maintenance' };
    case 'administration':
      return { icon: '📋', label: 'Administration' };
    case 'transport':
      return { icon: '🚛', label: 'Transport' };
    default:
      return { icon: '👤', label: department || 'Général' };
  }
};

const getAccessLevelConfig = (accessLevel) => {
  switch (accessLevel?.toLowerCase()) {
    case 'admin':
      return { color: 'text-red-600 bg-red-100', label: 'Admin', priority: 1 };
    case 'supervisor':
      return { color: 'text-blue-600 bg-blue-100', label: 'Superviseur', priority: 2 };
    case 'manager':
      return { color: 'text-green-600 bg-green-100', label: 'Manager', priority: 3 };
    default:
      return { color: 'text-gray-600 bg-gray-100', label: 'Employé', priority: 4 };
  }
};

const getEmploymentTypeConfig = (type) => {
  switch (type?.toLowerCase()) {
    case 'permanent':
      return { color: 'text-green-700 bg-green-50 border-green-200', label: 'Permanent' };
    case 'saisonnier':
      return { color: 'text-orange-700 bg-orange-50 border-orange-200', label: 'Saisonnier' };
    case 'contractuel':
      return { color: 'text-blue-700 bg-blue-50 border-blue-200', label: 'Contractuel' };
    default:
      return { color: 'text-gray-700 bg-gray-50 border-gray-200', label: type || 'Autre' };
  }
};

const getStatusConfig = (status, endDate) => {
  const today = new Date();
  const end = new Date(endDate);
  
  if (status?.toLowerCase() === 'inactive') {
    return { 
      color: 'text-red-700 bg-red-50 border-red-200', 
      icon: AlertTriangle, 
      label: 'Inactif',
      priority: 1
    };
  }
  
  // Contrat bientôt fini (moins de 30 jours)
  if (endDate && !isNaN(+end)) {
    const daysUntilEnd = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    if (daysUntilEnd <= 30 && daysUntilEnd > 0) {
      return { 
        color: 'text-orange-700 bg-orange-50 border-orange-200', 
        icon: Clock, 
        label: 'Contrat expire',
        priority: 2
      };
    }
    if (daysUntilEnd <= 0) {
      return { 
        color: 'text-red-700 bg-red-50 border-red-200', 
        icon: AlertTriangle, 
        label: 'Contrat expiré',
        priority: 1
      };
    }
  }
  
  return { 
    color: 'text-green-700 bg-green-50 border-green-200', 
    icon: CheckCircle, 
    label: 'Actif',
    priority: 4
  };
};

export default function AdminStaffPanel({ staff = [] }) {
  const [expandedDepartments, setExpandedDepartments] = useState(new Set());
  const [expandedStaff, setExpandedStaff] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const items = Array.isArray(staff) ? staff : [];

  // Stats sûres
  const totalStaff = items.length;
  const activeStaff = items.filter(person => person?.status === 'active').length;
  const totalSalary = items.reduce((acc, person) => acc + (Number(person?.salary) || 0), 0);
  const departments = new Set(items.map(person => person?.department)).size;

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const d = new Date(dateString);
    return isNaN(+d) ? '—' : d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: '2-digit' });
  };

  const getAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birth = new Date(dateOfBirth);
    if (isNaN(+birth)) return null;
    return Math.floor((today - birth) / (1000 * 60 * 60 * 24 * 365));
  };

  const getDaysUntilContractEnd = (endDate) => {
    if (!endDate) return null;
    const today = new Date();
    const end = new Date(endDate);
    if (isNaN(+end)) return null;
    return Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  };

  const toggleExpandDepartment = (departmentName) => {
    const newExpanded = new Set(expandedDepartments);
    if (newExpanded.has(departmentName)) {
      newExpanded.delete(departmentName);
    } else {
      newExpanded.add(departmentName);
    }
    setExpandedDepartments(newExpanded);
  };

  const toggleExpandStaff = (staffId) => {
    const newExpanded = new Set(expandedStaff);
    if (newExpanded.has(staffId)) {
      newExpanded.delete(staffId);
    } else {
      newExpanded.add(staffId);
    }
    setExpandedStaff(newExpanded);
  };

  // Filtrer par recherche
  const filteredItems = items.filter(person => 
    !searchTerm || 
    person.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Regroupement par département
  const staffByDepartment = filteredItems.reduce((groups, person) => {
    const department = person?.department || 'Général';
    if (!groups[department]) groups[department] = [];
    groups[department].push(person);
    return groups;
  }, {});

  return (
    <div className="bg-white">
      {/* Header avec métriques visuelles */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900">👥 Gestion du Personnel</h2>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher employé..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Live</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{totalStaff}</div>
            <div className="text-xs text-gray-500">Employés</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{activeStaff}</div>
            <div className="text-xs text-gray-500">Actifs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalSalary.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Masse salariale</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{departments}</div>
            <div className="text-xs text-gray-500">Départements</div>
          </div>
        </div>
      </div>

      {/* Liste par départements */}
      <div className="divide-y divide-gray-100">
        {Object.keys(staffByDepartment).length > 0 ? (
          Object.entries(staffByDepartment).map(([department, departmentStaff]) => {
            const isExpanded = expandedDepartments.has(department);
            const departmentConfig = getDepartmentConfig(department);
            const alertCount = departmentStaff.filter(person => {
              const status = getStatusConfig(person?.status, person?.endDate);
              return status.priority <= 2;
            }).length;

            return (
              <div key={department} className="hover:bg-gray-50 transition-colors">
                {/* Ligne de département */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <button
                        onClick={() => toggleExpandDepartment(department)}
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
                            <span className="text-lg">{departmentConfig.icon}</span>
                            <h3 className="font-semibold text-gray-900 text-base capitalize">
                              {department}
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
                            <Users className="h-4 w-4 text-blue-600" />
                            <span className="font-bold text-blue-600">{departmentStaff.length}</span>
                            <span className="text-gray-500">employé{departmentStaff.length > 1 ? 's' : ''}</span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span className="font-bold text-green-600">
                              {departmentStaff.reduce((acc, person) => acc + (Number(person?.salary) || 0), 0).toLocaleString()}
                            </span>
                            <span className="text-gray-500">FCFA/mois</span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <Award className="h-4 w-4 text-purple-600" />
                            <span className="font-bold text-purple-600">
                              {departmentStaff.filter(p => Array.isArray(p?.skills) && p.skills.length > 0).length}
                            </span>
                            <span className="text-gray-500">qualifié{departmentStaff.filter(p => Array.isArray(p?.skills) && p.skills.length > 0).length > 1 ? 's' : ''}</span>
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

                {/* Liste des employés */}
                {isExpanded && (
                  <div className="px-4 pb-4 bg-gradient-to-b from-gray-50 to-white border-t border-gray-100">
                    <div className="pt-4 space-y-3">
                      {departmentStaff
                        .sort((a, b) => {
                          const statusA = getStatusConfig(a?.status, a?.endDate);
                          const statusB = getStatusConfig(b?.status, b?.endDate);
                          return statusA.priority - statusB.priority;
                        })
                        .map((person) => {
                          const isPersonExpanded = expandedStaff.has(person.id);
                          const statusConfig = getStatusConfig(person?.status, person?.endDate);
                          const accessLevelConfig = getAccessLevelConfig(person?.accessLevel);
                          const employmentConfig = getEmploymentTypeConfig(person?.employmentType);
                          const age = getAge(person?.dateOfBirth);
                          const daysUntilEnd = getDaysUntilContractEnd(person?.endDate);
                          const StatusIcon = statusConfig.icon;

                          return (
                            <div key={person.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                              {/* Ligne compacte d'employé */}
                              <div className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                                    <button
                                      onClick={() => toggleExpandStaff(person.id)}
                                      className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors"
                                    >
                                      {isPersonExpanded ? (
                                        <ChevronDown className="h-4 w-4 text-gray-400" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4 text-gray-400" />
                                      )}
                                    </button>

                                    <StatusIcon className={`w-4 h-4 flex-shrink-0 ${statusConfig.color.split(' ')[0]}`} />

                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <h4 className="font-semibold text-gray-900">
                                            {person.firstName} {person.lastName}
                                          </h4>
                                          <p className="text-sm text-gray-500 truncate">
                                            {person.position} • {person.employmentType} • {age ? `${age} ans` : ''}
                                          </p>
                                        </div>
                                        
                                        <div className="flex items-center space-x-4 text-sm">
                                          <span className={`px-2 py-1 rounded text-xs font-medium ${accessLevelConfig.color}`}>
                                            {accessLevelConfig.label}
                                          </span>
                                          {person.phone && (
                                            <span className="text-gray-600 flex items-center">
                                              <Phone className="h-3 w-3 mr-1" />
                                              {person.phone.substring(0, 10)}
                                            </span>
                                          )}
                                          {Array.isArray(person.skills) && person.skills.length > 0 && (
                                            <span className="text-purple-600 flex items-center">
                                              <Award className="h-3 w-3 mr-1" />
                                              {person.skills.length} compétence{person.skills.length > 1 ? 's' : ''}
                                            </span>
                                          )}
                                          {daysUntilEnd !== null && daysUntilEnd <= 30 && (
                                            <span className={`font-medium flex items-center ${
                                              daysUntilEnd < 0 ? 'text-red-600' : 
                                              daysUntilEnd <= 30 ? 'text-orange-600' : 'text-gray-600'
                                            }`}>
                                              <Clock className="h-3 w-3 mr-1" />
                                              {daysUntilEnd < 0 
                                                ? `Expiré ${Math.abs(daysUntilEnd)}j` 
                                                : `${daysUntilEnd}j`
                                              }
                                            </span>
                                          )}
                                          <span className="font-bold text-green-600 flex items-center">
                                            <DollarSign className="h-3 w-3 mr-1" />
                                            {(Number(person.salary) || 0).toLocaleString()}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border ${statusConfig.color} ml-3`}>
                                    <StatusIcon className="h-3 w-3 mr-1" />
                                    {statusConfig.label}
                                  </span>
                                </div>
                              </div>

                              {/* Détails expandables d'employé */}
                              {isPersonExpanded && (
                                <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
                                  <div className="pt-4 grid grid-cols-3 gap-4">
                                    {/* Informations personnelles */}
                                    <div className="bg-white p-3 rounded border">
                                      <h5 className="text-sm font-bold text-gray-900 mb-2 flex items-center">
                                        <User className="h-4 w-4 mr-1" />
                                        PERSONNEL
                                      </h5>
                                      <div className="space-y-1 text-xs">
                                        <div className="flex justify-between">
                                          <span className="text-gray-500">Genre:</span>
                                          <span className="font-medium capitalize">{person.gender || '—'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-500">Âge:</span>
                                          <span className="font-medium">{age ? `${age} ans` : '—'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-500">Email:</span>
                                          <span className="font-medium text-xs truncate">{person.email || '—'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-500">Langues:</span>
                                          <span className="font-medium text-xs">
                                            {Array.isArray(person.languages) ? person.languages.length : 0}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Emploi */}
                                    <div className="bg-white p-3 rounded border">
                                      <h5 className="text-sm font-bold text-gray-900 mb-2 flex items-center">
                                        <Briefcase className="h-4 w-4 mr-1" />
                                        EMPLOI
                                      </h5>
                                      <div className="space-y-1 text-xs">
                                        <div className="flex justify-between">
                                          <span className="text-gray-500">Début:</span>
                                          <span className="font-medium">{formatDate(person.startDate)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-500">Fin:</span>
                                          <span className="font-medium">{formatDate(person.endDate)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-500">Type:</span>
                                          <span className={`px-1 py-0.5 rounded text-xs ${employmentConfig.color.includes('bg') ? employmentConfig.color.split(' ').slice(1).join(' ') : 'bg-gray-100'}`}>
                                            {employmentConfig.label}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-500">Paiement:</span>
                                          <span className="font-medium capitalize">{person.paymentMethod || '—'}</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Salaire & Contact */}
                                    <div className="bg-white p-3 rounded border">
                                      <h5 className="text-sm font-bold text-gray-900 mb-2 flex items-center">
                                        <TrendingUp className="h-4 w-4 mr-1" />
                                        RÉMUNÉRATION
                                      </h5>
                                      <div className="space-y-1 text-xs">
                                        <div className="flex justify-between">
                                          <span className="text-gray-500">Salaire:</span>
                                          <span className="font-bold text-green-600">{(Number(person.salary) || 0).toLocaleString()} FCFA</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-500">Type:</span>
                                          <span className="font-medium capitalize">{person.salaryType || '—'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-500">Devise:</span>
                                          <span className="font-medium">{person.currency || 'FCFA'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-500">Urgence:</span>
                                          <span className="font-medium text-xs">{person.emergencyContact?.name || '—'}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Compétences */}
                                  {Array.isArray(person.skills) && person.skills.length > 0 && (
                                    <div className="mt-3 bg-blue-50 p-3 rounded border border-blue-200">
                                      <h5 className="text-xs font-bold text-gray-900 mb-2 flex items-center">
                                        <Award className="h-3 w-3 mr-1" />
                                        COMPÉTENCES
                                      </h5>
                                      <div className="flex flex-wrap gap-1">
                                        {person.skills.map((skill, idx) => (
                                          <span
                                            key={idx}
                                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                                          >
                                            {skill}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Notes */}
                                  {person.notes && person.notes.trim() && (
                                    <div className="mt-3 bg-yellow-50 p-3 rounded border border-yellow-200">
                                      <h5 className="text-xs font-bold text-gray-900 mb-1 flex items-center">
                                        <Archive className="h-3 w-3 mr-1" />
                                        NOTES
                                      </h5>
                                      <p className="text-xs text-gray-700">{person.notes}</p>
                                    </div>
                                  )}
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
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-500 mb-2">
              {searchTerm ? 'Aucun employé trouvé' : 'Aucun employé disponible'}
            </p>
            <p className="text-sm text-gray-400">
              {searchTerm ? 'Essayez un autre terme de recherche' : 'Les employés apparaîtront ici une fois ajoutés'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}