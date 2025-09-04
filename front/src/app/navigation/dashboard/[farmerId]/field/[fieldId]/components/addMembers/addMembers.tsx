'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
  Star,
  Camera,
  Users,
  Shield,
  Clock,
  Award,
  AlertCircle,
  UserPlus,
  Settings,
} from 'lucide-react';
import {
  createMemberForFarmer,
  updateMember,
} from '../../../../../../../../../api/members';

type Member = { id: string; [k: string]: any };

type AddMemberModalProps = {
  showAddMembers: boolean;
  setShowAddMembers: (v: boolean) => void;
  farmerId: string;
  selectedMember: Member | null;
  onSave: (member: Member) => void; // <-- OBLIGATOIRE
  source?: string;
};

export default function AddMemberModal(props: AddMemberModalProps) {
  const {
    showAddMembers,
    setShowAddMembers,
    farmerId,
    selectedMember,
    onSave,
    source,
  } = props;
  console.log('[MODAL mount]', { source, onSaveType: typeof onSave }); // <-- IMPORTANT

  const [newMember, setNewMember] = useState({
    // Informations personnelles
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    nationalId: '',

    // Coordonnées
    phone: '',
    email: '',
    address: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: '',
    },

    // Informations professionnelles
    position: '',
    department: '',
    employmentType: '', // permanent, saisonnier, temporaire
    startDate: '',
    endDate: '', // pour les saisonniers
    workSchedule: '',

    // Rémunération
    salaryType: '', // horaire, journalier, mensuel, à la tâche
    salary: '',
    currency: 'FCFA',
    paymentMethod: '',

    // Compétences et formation
    skills: [],
    certifications: [],
    experience: '',
    languages: [],

    // Statut et permissions
    status: 'active', // active, inactive, on_leave
    permissions: [],
    accessLevel: 'worker', // worker, supervisor, manager

    // Informations supplémentaires
    photo: '',
    notes: '',
    documents: [], // contrats, certificats, etc.
  });

  const defaultMemberData = {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    nationalId: '',
    phone: '',
    email: '',
    address: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: '',
    },
    position: '',
    department: '',
    employmentType: '',
    startDate: '',
    endDate: '',
    workSchedule: '',
    salaryType: '',
    salary: '',
    currency: 'FCFA',
    paymentMethod: '',
    skills: [],
    certifications: [],
    experience: '',
    languages: [],
    status: 'active',
    permissions: [],
    accessLevel: 'worker',
    photo: '',
    notes: '',
    documents: [],
  };

  const [currentStep, setCurrentStep] = useState(1); // 1: Personal, 2: Professional, 3: Skills
  const totalSteps = 3;

  useEffect(() => {
    if (showAddMembers) {
      if (selectedMember) {
        // copie uniquement les champs autorisés
        const { id, createdAt, updatedAt, farmer, ...allowed } =
          selectedMember as any;
        setNewMember((prev) => ({ ...prev, ...allowed }));
      } else {
        setNewMember(defaultMemberData); // nouveau
      }
    }
  }, [showAddMembers, selectedMember]);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setNewMember((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setNewMember((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleArrayInput = (field, value, action = 'add') => {
    setNewMember((prev) => ({
      ...prev,
      [field]:
        action === 'add'
          ? [...prev[field], value]
          : prev[field].filter((item) => item !== value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEditing = !!selectedMember?.id;

    // Nettoyage du payload (pas d’ID/timestamps/relations)
    const cleaned: any = { ...newMember };
    delete cleaned.id;
    delete cleaned.createdAt;
    delete cleaned.updatedAt;
    delete cleaned.farmer;
    cleaned.salary = cleaned.salary.toString();

    try {
      const data = isEditing
        ? await updateMember(String(selectedMember!.id), cleaned)
        : await createMemberForFarmer(String(farmerId), cleaned);

      console.log(isEditing ? 'Membre modifié' : 'Membre ajouté', data);

      if (typeof onSave !== 'function') {
        console.warn('onSave manquant ou non-fonction :', onSave);
        return;
      }
      onSave(data);
      setShowAddMembers(false);
      setCurrentStep(1);
    } catch (err) {
      console.error('Erreur réseau / API membres :', err);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skillOptions = [
    'Conduite tracteur',
    'Irrigation',
    'Plantation',
    'Récolte',
    'Traitement phytosanitaire',
    'Maintenance équipement',
    'Gestion stock',
    'Vente',
    'Comptabilité',
    'Management',
    'Autre'
  ];

  const positionOptions = [
    'Ouvrier agricole',
    'Tractoriste',
    'Responsable irrigation',
    'Chef de culture',
    'Responsable élevage',
    'Magasinier',
    'Commercial',
    'Comptable',
    'Superviseur',
    'Manager',
    'Autre'
  ];

  if (!showAddMembers) return null;

  return (
    <div className="fixed inset-0 bg-opacity-100 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* En-tête avec progression */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <UserPlus className="w-8 h-8 mr-3" />
              <div>
                <h2 className="text-2xl font-bold">Ajouter un Membre</h2>
                <p className="text-blue-100">
                  Enregistrer un nouveau travailleur
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddMembers(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Barre de progression */}
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center justify-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step <= currentStep
                      ? 'bg-white text-blue-600'
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  {step}
                </div>
                {step < totalSteps && (
                  <div className="w-8 h-1 bg-blue-400 ml-2" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-2 text-sm text-blue-100 flex items-center justify-center">
            Étape {currentStep} sur {totalSteps}:{' '}
            {currentStep === 1
              ? 'Informations personnelles'
              : currentStep === 2
              ? 'Informations professionnelles'
              : 'Compétences et finition'}
          </div>
        </div>

        <div className="p-6">
          {/* Étape 1: Informations personnelles */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center mb-6">
                <User className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">
                  Informations Personnelles
                </h3>
              </div>

              {/* Nom et prénom */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    value={newMember.firstName}
                    onChange={(e) =>
                      handleInputChange('firstName', e.target.value)
                    }
                    required
                    className="text-gray-700 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Amadou"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de famille *
                  </label>
                  <input
                    type="text"
                    value={newMember.lastName}
                    onChange={(e) =>
                      handleInputChange('lastName', e.target.value)
                    }
                    required
                    className=" text-gray-700 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Diallo"
                  />
                </div>
              </div>

              {/* Date de naissance et genre */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de naissance
                  </label>
                  <input
                    type="date"
                    value={newMember.dateOfBirth}
                    onChange={(e) =>
                      handleInputChange('dateOfBirth', e.target.value)
                    }
                    className="text-gray-700 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Genre
                  </label>
                  <select
                    value={newMember.gender}
                    onChange={(e) =>
                      handleInputChange('gender', e.target.value)
                    }
                    className="text-gray-700 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner</option>
                    <option value="homme">Homme</option>
                    <option value="femme">Femme</option>
                  </select>
                </div>
              </div>

              {/* Coordonnées */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone *
                  </label>
                  <div className="relative">
                    <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="tel"
                      value={newMember.phone}
                      onChange={(e) =>
                        handleInputChange('phone', e.target.value)
                      }
                      required
                      className="text-gray-700 w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+221 XX XXX XX XX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="email"
                      value={newMember.email}
                      onChange={(e) =>
                        handleInputChange('email', e.target.value)
                      }
                      className="text-gray-700 w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="exemple@email.com"
                    />
                  </div>
                </div>
              </div>

              {/* Adresse */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse
                </label>
                <div className="relative">
                  <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                  <textarea
                    value={newMember.address}
                    onChange={(e) =>
                      handleInputChange('address', e.target.value)
                    }
                    rows="3"
                    className="text-gray-700 w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Adresse complète..."
                  />
                </div>
              </div>

              {/* Contact d'urgence */}
              <div className="bg-red-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  Contact d'urgence
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={newMember.emergencyContact.name}
                    onChange={(e) =>
                      handleInputChange('emergencyContact.name', e.target.value)
                    }
                    placeholder="Nom complet"
                    className="text-gray-700 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                  <input
                    type="tel"
                    value={newMember.emergencyContact.phone}
                    onChange={(e) =>
                      handleInputChange(
                        'emergencyContact.phone',
                        e.target.value
                      )
                    }
                    placeholder="Téléphone"
                    className="text-gray-700 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                  <input
                    type="text"
                    value={newMember.emergencyContact.relationship}
                    onChange={(e) =>
                      handleInputChange(
                        'emergencyContact.relationship',
                        e.target.value
                      )
                    }
                    placeholder="Relation (époux, parent...)"
                    className="text-gray-700 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Étape 2: Informations professionnelles */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center mb-6">
                <Briefcase className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">
                  Informations Professionnelles
                </h3>
              </div>

              {/* Poste et département */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poste *
                  </label>
                  <select
                    value={newMember.position}
                    onChange={(e) =>
                      handleInputChange('position', e.target.value)
                    }
                    required
                    className="text-gray-700 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner un poste</option>
                    {positionOptions.map((position) => (
                      <option key={position} value={position}>
                        {position}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Département
                  </label>
                  <select
                    value={newMember.department}
                    onChange={(e) =>
                      handleInputChange('department', e.target.value)
                    }
                    className="text-gray-700 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner</option>
                    <option value="production">Production</option>
                    <option value="elevage">Élevage</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="commercial">Commercial</option>
                    <option value="administration">Administration</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
              </div>

              {/* Type d'emploi et dates */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type d'emploi *
                  </label>
                  <select
                    value={newMember.employmentType}
                    onChange={(e) =>
                      handleInputChange('employmentType', e.target.value)
                    }
                    required
                    className="text-gray-700 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner</option>
                    <option value="permanent">Permanent</option>
                    <option value="saisonnier">Saisonnier</option>
                    <option value="temporaire">Temporaire</option>
                    <option value="stage">Stagiaire</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de début *
                  </label>
                  <input
                    type="date"
                    value={newMember.startDate}
                    onChange={(e) =>
                      handleInputChange('startDate', e.target.value)
                    }
                    required
                    className="text-gray-700 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {(newMember.employmentType === 'saisonnier' ||
                  newMember.employmentType === 'temporaire') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de fin
                    </label>
                    <input
                      type="date"
                      value={newMember.endDate}
                      onChange={(e) =>
                        handleInputChange('endDate', e.target.value)
                      }
                      className="text-gray-700 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>

              {/* Rémunération */}
              <div className="bg-green-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                  Rémunération
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Type de salaire
                    </label>
                    <select
                      value={newMember.salaryType}
                      onChange={(e) =>
                        handleInputChange('salaryType', e.target.value)
                      }
                      className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Sélectionner</option>
                      <option value="horaire">Horaire</option>
                      <option value="journalier">Journalier</option>
                      <option value="mensuel">Mensuel</option>
                      <option value="tache">À la tâche</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Montant
                    </label>
                    <input
                      type="number"
                      value={newMember.salary}
                      onChange={(e) =>
                        handleInputChange('salary', e.target.value)
                      }
                      placeholder="Ex: 2500"
                      className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Mode de paiement
                    </label>
                    <select
                      value={newMember.paymentMethod}
                      onChange={(e) =>
                        handleInputChange('paymentMethod', e.target.value)
                      }
                      className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Sélectionner</option>
                      <option value="especes">Espèces</option>
                      <option value="virement">Virement</option>
                      <option value="mobile_money">Mobile Money</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Horaires de travail */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horaires de travail
                </label>
                <div className="relative">
                  <Clock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                  <textarea
                    value={newMember.workSchedule}
                    onChange={(e) =>
                      handleInputChange('workSchedule', e.target.value)
                    }
                    rows="2"
                    className="text-gray-700 w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Lundi-Vendredi 7h-17h, Samedi 7h-12h"
                  />
                </div>
              </div>

              {/* Niveau d'accès */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Niveau d'accès
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {['worker', 'supervisor', 'manager'].map((level) => (
                    <label
                      key={level}
                      className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        name="accessLevel"
                        value={level}
                        checked={newMember.accessLevel === level}
                        onChange={(e) =>
                          handleInputChange('accessLevel', e.target.value)
                        }
                        className="text-gray-700 mr-3"
                      />
                      <div>
                        <div className="text-gray-700 font-medium capitalize">
                          {level === 'worker'
                            ? 'Ouvrier'
                            : level === 'supervisor'
                            ? 'Superviseur'
                            : 'Manager'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {level === 'worker'
                            ? 'Accès basique'
                            : level === 'supervisor'
                            ? 'Gestion équipe'
                            : 'Accès complet'}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Étape 3: Compétences et finition */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center mb-6">
                <Star className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">
                  Compétences et Finition
                </h3>
              </div>

              {/* Compétences */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Compétences principales
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {skillOptions.map((skill) => (
                    <label
                      key={skill}
                      className="text-gray-700 flex items-center p-2 border rounded-lg cursor-pointer hover:bg-blue-50"
                    >
                      <input
                        type="checkbox"
                        checked={newMember.skills.includes(skill)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleArrayInput('skills', skill, 'add');
                          } else {
                            handleArrayInput('skills', skill, 'remove');
                          }
                        }}
                        className="text-gray-700 mr-2"
                      />
                      <span className="text-sm">{skill}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Expérience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expérience professionnelle
                </label>
                <textarea
                  value={newMember.experience}
                  onChange={(e) =>
                    handleInputChange('experience', e.target.value)
                  }
                  rows="4"
                  className="text-gray-700 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Décrivez l'expérience professionnelle précédente..."
                />
              </div>

              {/* Langues */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Langues parlées
                </label>
                <div className="text-gray-700 grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    'Français',
                    'Wolof',
                    'Pulaar',
                    'Serer',
                    'Diola',
                    'Mandinka',
                    'Anglais',
                    'Arabe',
                  ].map((language) => (
                    <label
                      key={language}
                      className="flex items-center p-2 border rounded-lg cursor-pointer hover:bg-green-50"
                    >
                      <input
                        type="checkbox"
                        checked={newMember.languages.includes(language)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleArrayInput('languages', language, 'add');
                          } else {
                            handleArrayInput('languages', language, 'remove');
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{language}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes additionnelles
                </label>
                <textarea
                  value={newMember.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows="3"
                  className="text-gray-700 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Informations supplémentaires, observations..."
                />
              </div>

              {/* Récapitulatif */}
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-semibold text-blue-900 mb-3">
                  Récapitulatif
                </h4>
                <div className="text-gray-700 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Nom complet:</strong> {newMember.firstName}{' '}
                    {newMember.lastName}
                  </div>
                  <div>
                    <strong>Poste:</strong> {newMember.position}
                  </div>
                  <div>
                    <strong>Type d'emploi:</strong> {newMember.employmentType}
                  </div>
                  <div>
                    <strong>Téléphone:</strong> {newMember.phone}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Boutons de navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Précédent
                </button>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowAddMembers(false)}
                className="px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
                >
                  Suivant
                  <span className="ml-2">→</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex items-center px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Enregistrer le Membre
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
