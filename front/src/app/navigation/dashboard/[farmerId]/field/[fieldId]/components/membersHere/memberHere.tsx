'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  User,
  Phone,
  Mail,
  Briefcase,
  Star,
  Eye,
  Shield,
  Award,
  X,
  Cloud,
  Download,
  Edit2,
  Trash2,
  FileText,
  AlertCircle,
  CreditCard,
  MapPin,
  ChevronDown,
  ChevronUp,
  Calendar,
  AccessibilityIcon,
  Edit3,
  Building,
  Clock,
  DollarSign,
  Globe,
  Plus,
  User2,
} from 'lucide-react';
import { ActionMenu } from '../actionMenu/actionMenu';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import AddMemberModal from '../addMembers/addMembers';

type Member = {
  id: string;
  firstName: string;
  lastName: string;
  department?: string;
  status?: string;
};

// Composant principal pour afficher les membres
export default function TeamMembersDisplay({
  members = [],
  onEdit,
  onDelete,
  deletingId,
}: // (tu peux garder tes états de filtre/recherche si tu veux)
{
  farmerId: string;
  fieldId: string;
  members: Member[];
  onDelete: (id: string) => void;
  deletingId?: string | null;
}) {
  console.log('[CHILD] received members length:', members.length);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedMember, setSelectedMember] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid ou list
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatSalary = (salary, currency = 'FCFA') => {
    return new Intl.NumberFormat('fr-FR').format(salary) + ` ${currency}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'on_leave':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccessLevelIcon = (level) => {
    switch (level) {
      case 'manager':
        return <Shield className="w-4 h-4 text-purple-600" />;
      case 'supervisor':
        return <Award className="w-4 h-4 text-blue-600" />;
      case 'worker':
        return <User className="w-4 h-4 text-gray-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getEmploymentTypeColor = (type) => {
    switch (type) {
      case 'permanent':
        return 'bg-blue-100 text-blue-800';
      case 'saisonnier':
        return 'bg-orange-100 text-orange-800';
      case 'temporaire':
        return 'bg-purple-100 text-purple-800';
      case 'stage':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount, currency) => {
    return `${amount.toLocaleString('fr-FR')} ${currency}`;
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const calculateYearsOfService = (startDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const years = today.getFullYear() - start.getFullYear();
    return years;
  };

  const getStatusConfig = (status) => {
    const configs = {
      active: {
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        label: 'Actif',
        dot: 'bg-emerald-500',
      },
      inactive: {
        color: 'bg-red-100 text-red-800 border-red-200',
        label: 'Inactif',
        dot: 'bg-red-500',
      },
      leave: {
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        label: 'En congé',
        dot: 'bg-amber-500',
      },
    };
    return configs[status] || configs.active;
  };

  const getAccessLevelConfig = (level) => {
    const configs = {
      worker: {
        icon: Users,
        label: 'Ouvrier',
        color: 'text-blue-600 bg-blue-50',
        border: 'border-blue-200',
      },
      supervisor: {
        icon: Shield,
        label: 'Superviseur',
        color: 'text-purple-600 bg-purple-50',
        border: 'border-purple-200',
      },
      manager: {
        icon: Award,
        label: 'Manager',
        color: 'text-orange-600 bg-orange-50',
        border: 'border-orange-200',
      },
    };
    return configs[level] || configs.worker;
  };

  const getEmploymentTypeConfig = (type) => {
    const configs = {
      permanent: {
        label: 'Permanent',
        color: 'bg-green-50 text-green-700 border-green-200',
      },
      saisonnier: {
        label: 'Saisonnier',
        color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      },
      temporaire: {
        label: 'Temporaire',
        color: 'bg-orange-50 text-orange-700 border-orange-200',
      },
      stagiaire: {
        label: 'Stagiaire',
        color: 'bg-blue-50 text-blue-700 border-blue-200',
      },
    };
    return configs[type] || configs.permanent;
  };

  const ts = (d) => (d ? new Date(d).getTime() : 0); // 0 si pas de date
  const pickDate = (h) => h.createdAt ?? null;

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

  // Composant carte membre
  const MemberCard = ({ member }) => {
    const statusConfig = getStatusConfig(member.status);
    const accessConfig = getAccessLevelConfig(member.accessLevel);
    const employmentConfig = getEmploymentTypeConfig(member.employmentType);
    const AccessIcon = accessConfig.icon;

    const isExpanded = expandedCard === member.id;

    return (
      <div className="w-full max-w-md mx-auto">
        {/* Carte principale */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          {/* En-tête avec gradient moderne */}
          <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                {/* Photo de profil avec bordure élégante */}
                <div className="relative">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={`${member.firstName} ${member.lastName}`}
                        className="w-16 h-16 rounded-2xl object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 ${statusConfig.dot} rounded-full border-2 border-white`}
                  ></div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm"
                    onClick={() => onEdit(member)}
                    aria-label="Modifier l'employé"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm"
                    onClick={() => {
                      if (confirm('Supprimer cet employé ?'))
                        onDelete(member.id);
                    }}
                    aria-label="Supprimer l'employé"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Informations principales */}
              <div>
                <h3 className="text-xl font-bold mb-1">
                  {member.firstName} {member.lastName}
                </h3>
                <p className="text-white/80 text-sm mb-2">{member.position}</p>

                {/* Badges de statut */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}
                  >
                    {statusConfig.label}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${accessConfig.color} ${accessConfig.border}`}
                  >
                    <AccessibilityIcon className="w-3 h-3 inline mr-1" />
                    {accessConfig.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Corps de la carte */}
          <div className="p-6">
            {/* Informations essentielles */}
            <div className="space-y-4 mb-6">
              {/* Contact */}
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center text-gray-700">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mr-3">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{member.phone}</p>
                    <p className="text-xs text-gray-500">Téléphone</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-700">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mr-3">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium truncate">
                      {member.email}
                    </p>
                    <p className="text-xs text-gray-500">Email</p>
                  </div>
                </div>
              </div>

              {/* Département et emploi */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Briefcase className="w-5 h-5 text-gray-600 mr-2" />
                    <span className="font-semibold text-gray-800 capitalize">
                      {member.department}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-medium border ${employmentConfig.color}`}
                  >
                    {employmentConfig.label}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>
                    {calculateYearsOfService(member.startDate)} ans de service
                  </span>
                  <span className="mx-2">•</span>
                  <span>Depuis {formatDate(member.startDate)}</span>
                </div>
              </div>
            </div>

            {/* Compétences principales */}
            {member.skills && member.skills.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <Star className="w-4 h-4 mr-2 text-amber-500" />
                  <span className="text-sm font-semibold text-gray-800">
                    Compétences clés
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {member.skills.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium border border-blue-100"
                    >
                      {skill}
                    </span>
                  ))}
                  {member.skills.length > 3 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                      +{member.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Section détails pliable */}
            <div className="border-t border-gray-100 pt-4">
              <button
                onClick={() => setExpandedCard(isExpanded ? null : member.id)}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <span className="text-sm font-medium text-gray-700">
                  Détails complets
                </span>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>

              {isExpanded && (
                <div className="mt-4 space-y-4 bg-gray-50 rounded-xl p-4">
                  {/* Informations personnelles */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Informations personnelles
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Âge:</span>
                        <span className="font-medium">
                          {calculateAge(member.dateOfBirth)} ans
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Genre:</span>
                        <span className="font-medium capitalize">
                          {member.gender}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Langues:</span>
                        <div className="flex gap-1">
                          {member.languages.slice(0, 2).map((lang, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-white rounded text-xs"
                            >
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Adresse */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Adresse
                    </h4>
                    <p className="text-sm text-gray-600">{member.address}</p>
                  </div>

                  {/* Salaire */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Rémunération
                    </h4>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        Salaire {member.salaryType}:
                      </span>
                      <span className="font-bold text-green-600">
                        {formatCurrency(member.salary, member.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span className="text-gray-600">Mode de paiement:</span>
                      <span className="font-medium capitalize">
                        {member.paymentMethod}
                      </span>
                    </div>
                  </div>

                  {/* Contact d'urgence */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Contact d'urgence
                    </h4>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nom:</span>
                        <span className="font-medium">
                          {member.emergencyContact.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Relation:</span>
                        <span className="font-medium">
                          {member.emergencyContact.relationship}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Téléphone:</span>
                        <span className="font-medium">
                          {member.emergencyContact.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions principales */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setSelectedMember(member)}
                className="flex-1 flex items-center justify-center px-4 py-3 text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg shadow-blue-600/25"
              >
                <Eye className="w-4 h-4 mr-2" />
                Voir le profil
              </button>
              <button className="px-4 py-3 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors font-medium border border-blue-100">
                <FileText className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modal de détails
  const MemberDetailModal = () => {
    if (!selectedMember) return null;

    return (
      <div className="fixed inset-0 bg-opacity-100 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* En-tête */}
          <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                {selectedMember.photo ? (
                  <img
                    src={selectedMember.photo}
                    alt="Profile"
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-500" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedMember.firstName} {selectedMember.lastName}
                </h2>
                <p className="text-gray-600">{selectedMember.position}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                      selectedMember.status
                    )}`}
                  >
                    {selectedMember.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getEmploymentTypeColor(
                      selectedMember.employmentType
                    )}`}
                  >
                    {selectedMember.employmentType.charAt(0).toUpperCase() +
                      selectedMember.employmentType.slice(1)}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedMember(null)}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Contenu */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Colonne gauche */}
              <div className="space-y-6">
                {/* Informations personnelles */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Informations Personnelles
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID:</span>
                      <span className="font-mono text-xs">
                        {selectedMember.id.slice(0, 13)}...
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date de naissance:</span>
                      <span>
                        {formatDate(selectedMember.dateOfBirth)} (
                        {calculateAge(selectedMember.dateOfBirth)} ans)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Genre:</span>
                      <span className="capitalize">
                        {selectedMember.gender}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID National:</span>
                      <span>
                        {selectedMember.nationalId || 'Non renseigné'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-green-600" />
                    Contact
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{selectedMember.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{selectedMember.email}</span>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                      <span>{selectedMember.address}</span>
                    </div>
                  </div>
                </div>

                {/* Contact d'urgence */}
                <div className="bg-red-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
                    Contact d'urgence
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nom:</span>
                      <span className="font-medium">
                        {selectedMember.emergencyContact.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Relation:</span>
                      <span>
                        {selectedMember.emergencyContact.relationship}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Téléphone:</span>
                      <span className="font-medium">
                        {selectedMember.emergencyContact.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Langues */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-indigo-600" />
                    Langues
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.languages.map((language, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Colonne droite */}
              <div className="space-y-6">
                {/* Informations professionnelles */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                    Informations Professionnelles
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Département:</span>
                      <span className="capitalize font-medium">
                        {selectedMember.department}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Niveau d'accès:</span>
                      <div className="flex items-center">
                        {getAccessLevelIcon(selectedMember.accessLevel)}
                        <span className="ml-1 capitalize">
                          {selectedMember.accessLevel === 'supervisor'
                            ? 'Superviseur'
                            : selectedMember.accessLevel === 'manager'
                            ? 'Manager'
                            : 'Ouvrier'}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date de début:</span>
                      <span>{formatDate(selectedMember.startDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ancienneté:</span>
                      <span className="font-medium text-blue-600">
                        {calculateYearsOfService(selectedMember.startDate)} ans
                      </span>
                    </div>
                    {selectedMember.endDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date de fin:</span>
                        <span>{formatDate(selectedMember.endDate)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Rémunération */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                    Rémunération
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Salaire {selectedMember.salaryType}:
                      </span>
                      <span className="font-bold text-green-600 text-lg">
                        {formatCurrency(
                          selectedMember.salary,
                          selectedMember.currency
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mode de paiement:</span>
                      <span className="capitalize">
                        {selectedMember.paymentMethod}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Salaire annuel (estimation):
                      </span>
                      <span className="font-medium">
                        {formatCurrency(
                          selectedMember.salary * 12,
                          selectedMember.currency
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Compétences */}
                <div className="bg-orange-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-orange-600" />
                    Compétences
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Horaires */}
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-purple-600" />
                    Horaires de travail
                  </h3>
                  <p className="text-sm text-gray-700">
                    {selectedMember.workSchedule}
                  </p>
                </div>

                {/* Documents et certifications */}
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-yellow-600" />
                    Documents & Certifications
                  </h3>
                  <div className="text-sm text-gray-600">
                    <p>
                      Documents: {selectedMember.documents.length || 'Aucun'}
                    </p>
                    <p>
                      Certifications:{' '}
                      {selectedMember.certifications.length || 'Aucune'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sections texte complètes */}
            <div className="mt-8 space-y-6">
              {/* Expérience */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Building className="w-5 h-5 mr-2 text-gray-600" />
                  Expérience professionnelle
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {selectedMember.experience}
                </p>
              </div>

              {/* Notes */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Notes et observations
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {selectedMember.notes}
                </p>
              </div>
            </div>

            {/* Métadonnées */}
            <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500 flex justify-between">
              <span>Créé le {formatDate(selectedMember.createdAt)}</span>
              <span>Mis à jour le {formatDate(selectedMember.updatedAt)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-gray-50 px-6 py-4 border-t flex justify-end space-x-3">
            <button
              onClick={() => setSelectedMember(null)}
              className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Fermer
            </button>
            <button
              onClick={() => onEdit(selectedMember)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Modifier
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Liste des membres */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {members
          .slice()
          .sort((a, b) => {
            return ts(pickDate(b)) - ts(pickDate(a));
          })
          .map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
      </div>
      {members.length === 0 && (
        <div className="text-center py-12">
          <User2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Aucun membre trouvé
          </h3>
          <p className="text-gray-500">
            Essayez de modifier vos critères de recherche ou de filtrage
          </p>
        </div>
      )}
      {/* Modal de détail */}
      <MemberDetailModal />
    </>
  );
}
