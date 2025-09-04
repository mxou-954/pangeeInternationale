'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  User,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  FileText,
  Upload,
  Calendar,
  Star,
  Edit,
  Save,
  X,
  Send,
  Paperclip,
  Download,
  Eye,
  Plus,
  Activity,
  AlertCircle,
  TrendingUp,
  Cloud,
  Trash,
  MessageSquare,
  RefreshCw,
  Warehouse,
  Tractor,
  User2,
} from 'lucide-react';

import {
  deleteFarmer,
  getFarmerById,
  toggleFarmerFavorite,
} from '../../../../../../../api/farmer';
import {
  createCommentForFarmer,
  deleteComment,
  getCommentsByFarmer,
} from '../../../../../../../api/comments';
import {
  createActivityForFarmer,
  getActivitiesByFarmer,
} from '../../../../../../../api/activity';
import {
  getDocumentsByUser,
  uploadDocument,
} from '../../../../../../../api/documents';
import { getLocationsPayload } from '../../addLocation/api/locations';

import dynamic from 'next/dynamic';
import { getFieldsByFarmer } from '../../../../../../../api/field';
import { getActivitiesAllByFarmer } from '../../../../../../../api/activities';
import { getMembersByFarmer } from '../../../../../../../api/members';
import { getAllStocks } from '../../../../../../../api/stocks';
import { getEquipementsByFarmer } from '../../../../../../../api/equipements';

import AdminFieldsPanel from '../../../components/adminViewFields/adminViewFields';
import AdminStocksPanel from '../../../components/adminViewStocks/adminViewStocks';
import AdminEquipmentPanel from '../../../components/adminViewEquipements/adminViewEquipements';
import AdminStaffPanel from '../../../components/adminViewMembers/adminViewMembers';

// IMPORTANT: ssr: false pour éviter l'import côté serveur
const MapRegionCity = dynamic(
  () => import('../../../components/MapRegionCity/MapRegionCity'),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 rounded-xl bg-gray-100 animate-pulse" />
    ),
  }
);

// Interface étendue pour l'agriculteur
interface Farmer {
  id?: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  country: string;
  region: string;
  commune: string;
  village: string;
  code: string;
  isFavorite: boolean;
  // Nouvelles propriétés
  farmType?: string;
  farmSize?: string;
  crops?: string[];
  coordinates?: { lat: number; lng: number };
  profileImage?: string;
}

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'admin' | 'farmer';
  attachments?: { name: string; url: string; type: string }[];
}

interface Comment {
  id: string;
  text: string;
  admin: string;
  createdAt: Date;
  farmer: Farmer;
}

interface Document {
  id: string;
  name: string;
  category: string;
  uploadDate: Date;
  url: string;
  type: string;
}

interface Activity {
  id: string;
  type:
    | 'message'
    | 'document'
    | 'profile_update'
    | 'visit'
    | 'comment'
    | 'commentDelete';
  description: string;
  timestamp: Date;
  author?: string;
}

type LocationsState = {
  countries: Array<{ id: string; name: string; code: string; flag?: string }>;
  regions: Record<string, Array<{ id: string; name: string }>>;
  communes: Record<string, Array<{ id: string; name: string }>>;
  villages: Record<string, Array<{ id: string; name: string }>>;
};

type Coords = { lat: number; lon: number; timezone?: string } | null;

export default function ViewFarmer() {
  const fileInputRef = useRef();
  const params = useParams<{ id: string }>();
  const farmerId = params.id;
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Farmer | null>(null);
  const [activityContent, setActivityContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [coords, setCoords] = useState<Coords>(null);
  const [locationData, setLocationData] = useState<LocationsState>({
    countries: [],
    regions: {},
    communes: {},
    villages: {},
  });
  const [fields, setFields] = useState([]);
  const [activitiesFarmer, setActivitiesFarmer] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [members, setMembers] = useState([]);
  const [equipements, setEquipements] = useState([]);

  const API_KEY_MAP = 'AIzaSyAW0F_C4bZgPR2hF6dofs4GaxDJoNUUcwk';

  useEffect(() => {
    getFarmerById(farmerId)
      .then((data) => {
        setFarmer(data);
        setEditForm(data);
      })
      .catch((err) => {
        console.error('Erreur chargement farmer :', err);
      })
      .finally(() => setLoading(false));
  }, [farmerId]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const payload = await getLocationsPayload();
        setLocationData(payload);
        setError(null);
      } catch (e: any) {
        setError(e?.message || 'Erreur de chargement.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!farmerId) return;
    const ac = new AbortController();

    (async () => {
      try {
        const [
          commentsData,
          activitiesData,
          documentsData,
          farmerData,
          activitiesFarmerData,
          membersData,
          stocksData,
          equipementData,
        ] = await Promise.all([
          getCommentsByFarmer(String(farmerId)),
          getActivitiesByFarmer(String(farmerId)),
          getDocumentsByUser(String(farmerId)),
          getFieldsByFarmer(String(farmerId)),
          getActivitiesAllByFarmer(String(farmerId)),
          getMembersByFarmer(String(farmerId)),
          getAllStocks(String(farmerId)),
          getEquipementsByFarmer(String(farmerId)),
        ]);

        if (ac.signal.aborted) return;
        setComments(commentsData);
        setActivities(activitiesData);
        setDocuments(documentsData);
        setFields(farmerData);
        console.log('Fields reçu : ', farmerData);
        setActivitiesFarmer(activitiesFarmerData);
        setMembers(membersData);
        console.log('Membres reçu : ', membersData);
        setStocks(stocksData);
        console.log('Stocks reçu : ', stocksData);
        setEquipements(equipementData);
        console.log('Equipements reçu : ', equipementData);
      } catch (err) {
        if (!ac.signal.aborted)
          console.error('Erreur chargement données:', err);
      }
    })();

    return () => ac.abort();
  }, [farmerId]);

  useEffect(() => {
    if (!farmerId) return;
    const ac = new AbortController();

    (async () => {
      try {
        const [commentsData, activitiesData, documentsData] = await Promise.all(
          [
            getCommentsByFarmer(String(farmerId)),
            getActivitiesByFarmer(String(farmerId)),
            getDocumentsByUser(String(farmerId)),
          ]
        );

        if (ac.signal.aborted) return;
        setComments(commentsData);
        setActivities(activitiesData);
        setDocuments(documentsData);
      } catch (err) {
        if (!ac.signal.aborted)
          console.error('Erreur chargement données:', err);
      }
    })();

    return () => ac.abort();
  }, [farmerId]);

  useEffect(() => {
    if (activityContent) {
      handleAddActivity();
    }
  }, [activityContent]);

  const handleAddActivity = async () => {
    try {
      const data = await createActivityForFarmer(farmerId, {
        type: activityContent,
      });

      setActivities([data, ...activities]);
      console.log('Activité ajoutée avec succès :', data);
    } catch (err) {
      console.error("Erreur lors de l'ajout d'activité :", err);
    }
  };

  const handleSaveProfile = () => {
    if (editForm) {
      // Appel API pour sauvegarder
      setFarmer(editForm);
      setIsEditing(false);
      // Ajouter une activité
      const newActivity: Activity = {
        id: Date.now().toString(),
        type: 'profile_update',
        description: 'Profil mis à jour',
        timestamp: new Date(),
        author: 'Admin',
      };
      setActivities([newActivity, ...activities]);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        content: newMessage,
        timestamp: new Date(),
        sender: 'admin',
      };
      setMessages([...messages, message]);
      setNewMessage('');

      // Ajouter une activité
      const newActivity: Activity = {
        id: Date.now().toString(),
        type: 'message',
        description: 'Message envoyé',
        timestamp: new Date(),
        author: 'Admin',
      };
      setActivities([newActivity, ...activities]);
    }
  };

  const handleAddComment = async () => {
    try {
      const data = await createCommentForFarmer(farmerId, { text: newComment });

      setComments([data, ...comments]);
      setNewComment('');
      setActivityContent('comment');
      console.log('Commentaire ajouté :', data);
    } catch (err) {
      console.error('Erreur ajout commentaire :', err);
    }
  };

  const handleToggleFavorite = async (id: string) => {
    try {
      const data = await toggleFarmerFavorite(id);
      setFarmer(data);
      setActivityContent('profile_update');
    } catch (err) {
      console.error('Erreur toggle favori :', err);
    }
  };

  const handleDeleteComment = async (id: string) => {
    try {
      await deleteComment(id);
      setComments((prev) => prev.filter((f) => f.id !== id));
      setActivityContent('commentDelete');
    } catch (err) {
      console.error('Erreur suppression commentaire :', err);
    }
  };

  const handleDeleteFarmer = async (id: string) => {
    try {
      await deleteFarmer(id);
      console.log('Farmer supprimé');
      window.location.href = '/pages/';
    } catch (err) {
      console.error('Erreur suppression farmer :', err);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await uploadDocument(farmerId, file);
      console.log('📁 Fichier envoyé :', data.url);
    } catch (err) {
      console.error('Erreur upload document :', err);
    }
  };

  const downloadFile = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Fonction pour obtenir l'icône selon le type d'activité
  const getActivityIcon = (type) => {
    switch (type) {
      case 'comment':
        return <Plus className="h-4 w-4 text-green-600" />;
      case 'profile_update':
        return <Edit className="h-4 w-4 text-blue-600" />;
      case 'commentDelete':
        return <Trash className="h-4 w-4 text-red-600" />;
      case 'message':
        return <MessageSquare className="h-4 w-4 text-purple-600" />;
      case 'document':
        return <Download className="h-4 w-4 text-orange-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  // Fonction pour obtenir la couleur du fond d'icône
  const getActivityColor = (type) => {
    switch (type) {
      case 'comment':
        return 'bg-green-100';
      case 'profile_update':
        return 'bg-blue-100';
      case 'commentDelete':
        return 'bg-red-100';
      case 'message':
        return 'bg-purple-100';
      case 'document':
        return 'bg-orange-100';
      default:
        return 'bg-gray-100';
    }
  };

  // Fonction pour obtenir la couleur du badge
  const getActivityBadgeColor = (type) => {
    switch (type) {
      case 'comment':
        return 'bg-green-100 text-green-800';
      case 'profile_update':
        return 'bg-blue-100 text-blue-800';
      case 'commentDelete':
        return 'bg-red-100 text-red-800';
      case 'message':
        return 'bg-purple-100 text-purple-800';
      case 'document':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Fonction pour obtenir le label du type
  const getActivityTypeLabel = (type) => {
    switch (type) {
      case 'comment':
        return 'Commentaire';
      case 'profile_update':
        return 'Profil modifié';
      case 'commentDelete':
        return 'Commentaire supprimé';
      case 'message':
        return 'Message';
      case 'document':
        return 'Document';
      default:
        return 'Activité';
    }
  };

  // Fonction pour formater la date
  const formatActivityDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60)
      return `Il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
    if (diffHours < 24)
      return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7)
      return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;

    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Fonction pour vérifier si l'activité est récente (moins de 24h)
  const isRecentActivity = (timestamp) => {
    if (!timestamp) return false;
    const diffMs = new Date() - new Date(timestamp);
    return diffMs < 86400000; // 24 heures
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!farmer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Agriculteur non trouvé</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête du profil */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {farmer.firstName} {farmer.lastName}
                </h1>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {farmer.villageName}, {farmer.communeName}
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    {farmer.phone}
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {farmer.email}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleToggleFavorite(farmer.id)}
                className={`p-2 rounded-lg ${
                  farmer.isFavorite ? 'text-yellow-500' : 'text-gray-400'
                }`}
              >
                <Star
                  className="h-5 w-5"
                  fill={farmer.isFavorite ? 'currentColor' : 'none'}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'profile', label: 'Profil', icon: User },
                { id: 'comments', label: 'Commentaires', icon: FileText },
                { id: 'documents', label: 'Documents', icon: Upload },
                { id: 'fields', label: 'Champs', icon: MapPin },
                { id: 'stocks', label: 'Stocks', icon: Warehouse },
                { id: 'equipements', label: 'Equipements', icon: Tractor },
                { id: 'members', label: 'Membres', icon: User2 },
                { id: 'activity', label: 'Historique', icon: Activity },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Contenu des onglets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            {activeTab === 'fields' && (
              <>
                <AdminFieldsPanel fields={fields} />
              </>
            )}
            {activeTab === 'stocks' && (
              <>
                <AdminStocksPanel stocks={stocks} />
              </>
            )}
            {activeTab === 'equipements' && (
              <>
                <AdminEquipmentPanel equipment={equipements} />
              </>
            )}
            {activeTab === 'members' && (
              <>
                <AdminStaffPanel staff={members} />
              </>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* En-tête avec dégradé et actions */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Informations du profil
                      {isEditing && (
                        <span className="ml-2 px-2 py-1 text-xs font-medium text-orange-800 bg-orange-100 rounded-full">
                          Mode édition
                        </span>
                      )}
                    </h2>

                    {/* Boutons d'action */}
                    <div className="flex items-center gap-3">
                      {isEditing && (
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                        >
                          Annuler
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (isEditing) {
                            handleSaveProfile();
                          } else {
                            setIsEditing(true);
                          }
                        }}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
                          isEditing
                            ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                            : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                        }`}
                      >
                        {isEditing ? (
                          <>
                            <Save className="h-4 w-4" />
                            <span>Sauvegarder</span>
                          </>
                        ) : (
                          <>
                            <Edit className="h-4 w-4" />
                            <span>Modifier</span>
                          </>
                        )}
                      </button>

                      <div className="w-px h-6 bg-gray-300" />

                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
                      >
                        <Trash className="h-4 w-4" />
                        <span>Supprimer</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Informations personnelles */}
                  <div className="mb-8">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                        />
                      </svg>
                      Informations personnelles
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Prénom */}
                      <div className="group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Prénom
                        </label>
                        {isEditing ? (
                          <div className="relative">
                            <input
                              type="text"
                              value={editForm?.firstName || ''}
                              onChange={(e) =>
                                setEditForm((prev) =>
                                  prev
                                    ? { ...prev, firstName: e.target.value }
                                    : null
                                )
                              }
                              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                              placeholder="Entrez le prénom"
                            />
                            <svg
                              className="absolute left-3 top-3.5 w-4 h-4 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                        ) : (
                          <div className="relative group">
                            <p className="pl-10 pr-3 py-3 bg-gray-50 rounded-lg text-gray-900 group-hover:bg-gray-100 transition-colors duration-200">
                              {farmer.firstName || (
                                <span className="text-gray-400">
                                  Non renseigné
                                </span>
                              )}
                            </p>
                            <svg
                              className="absolute left-3 top-3.5 w-4 h-4 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Nom */}
                      <div className="group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom
                        </label>
                        {isEditing ? (
                          <div className="relative">
                            <input
                              type="text"
                              value={editForm?.lastName || ''}
                              onChange={(e) =>
                                setEditForm((prev) =>
                                  prev
                                    ? { ...prev, lastName: e.target.value }
                                    : null
                                )
                              }
                              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                              placeholder="Entrez le nom"
                            />
                            <svg
                              className="absolute left-3 top-3.5 w-4 h-4 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                        ) : (
                          <div className="relative group">
                            <p className="pl-10 pr-3 py-3 bg-gray-50 rounded-lg text-gray-900 group-hover:bg-gray-100 transition-colors duration-200">
                              {farmer.lastName || (
                                <span className="text-gray-400">
                                  Non renseigné
                                </span>
                              )}
                            </p>
                            <svg
                              className="absolute left-3 top-3.5 w-4 h-4 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Téléphone */}
                      <div className="group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone
                        </label>
                        {isEditing ? (
                          <div className="relative">
                            <input
                              type="tel"
                              value={editForm?.phone || ''}
                              onChange={(e) =>
                                setEditForm((prev) =>
                                  prev
                                    ? { ...prev, phone: e.target.value }
                                    : null
                                )
                              }
                              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                              placeholder="+33 6 12 34 56 78"
                            />
                            <svg
                              className="absolute left-3 top-3.5 w-4 h-4 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                          </div>
                        ) : (
                          <div className="relative group">
                            <p className="pl-10 pr-3 py-3 bg-gray-50 rounded-lg text-gray-900 group-hover:bg-gray-100 transition-colors duration-200">
                              {farmer.phone || (
                                <span className="text-gray-400">
                                  Non renseigné
                                </span>
                              )}
                            </p>
                            <svg
                              className="absolute left-3 top-3.5 w-4 h-4 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Email */}
                      <div className="group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        {isEditing ? (
                          <div className="relative">
                            <input
                              type="email"
                              value={editForm?.email || ''}
                              onChange={(e) =>
                                setEditForm((prev) =>
                                  prev
                                    ? { ...prev, email: e.target.value }
                                    : null
                                )
                              }
                              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                              placeholder="email@exemple.com"
                            />
                            <svg
                              className="absolute left-3 top-3.5 w-4 h-4 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        ) : (
                          <div className="relative group">
                            <p className="pl-10 pr-3 py-3 bg-gray-50 rounded-lg text-gray-900 group-hover:bg-gray-100 transition-colors duration-200">
                              {farmer.email || (
                                <span className="text-gray-400">
                                  Non renseigné
                                </span>
                              )}
                            </p>
                            <svg
                              className="absolute left-3 top-3.5 w-4 h-4 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Localisation */}
                  <div className="mb-8">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Localisation
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Pays */}
                      <div className="group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pays
                        </label>
                        <div className="relative group">
                          <p className="pl-10 pr-3 py-3 bg-gray-50 rounded-lg text-gray-900 group-hover:bg-gray-100 transition-colors duration-200">
                            {farmer.countryName}
                          </p>
                          <svg
                            className="absolute left-3 top-3.5 w-4 h-4 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Région */}
                      <div className="group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Région
                        </label>
                        <div className="relative group">
                          <p className="pl-10 pr-3 py-3 bg-gray-50 rounded-lg text-gray-900 group-hover:bg-gray-100 transition-colors duration-200">
                            {farmer.regionName}
                          </p>
                          <svg
                            className="absolute left-3 top-3.5 w-4 h-4 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Commune */}
                      <div className="group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Commune
                        </label>
                        <div className="relative group">
                          <p className="pl-10 pr-3 py-3 bg-gray-50 rounded-lg text-gray-900 group-hover:bg-gray-100 transition-colors duration-200">
                            {farmer.communeName}
                          </p>
                          <svg
                            className="absolute left-3 top-3.5 w-4 h-4 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Village */}
                      <div className="group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Village
                        </label>
                        <div className="relative group">
                          <p className="pl-10 pr-3 py-3 bg-gray-50 rounded-lg text-gray-900 group-hover:bg-gray-100 transition-colors duration-200">
                            {farmer.villageName}
                          </p>
                          <svg
                            className="absolute left-3 top-3.5 w-4 h-4 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Carte de localisation */}
                  <div className="mt-8">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Carte de localisation
                    </h3>

                    <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden group">
                      <div className="rounded overflow-hidden">
                        <MapRegionCity
                          country={farmer.countryName}
                          region={farmer.regionName}
                          commune={farmer.communeName}
                          village={farmer.villageName}
                          countryCode={'ci'}
                          lang={'fr'}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showDeleteModal && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                    <svg
                      className="w-6 h-6 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>

                  <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                    Confirmer la suppression
                  </h3>

                  <p className="text-sm text-gray-500 text-center mb-6">
                    Êtes-vous sûr de vouloir supprimer le profil de{' '}
                    <strong>
                      {farmer.firstName} {farmer.lastName}
                    </strong>{' '}
                    ? Cette action est irréversible.
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => {
                        handleDeleteFarmer(farmer.id);
                        setShowDeleteModal(false);
                      }}
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* En-tête avec dégradé subtil */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                    Commentaires internes
                    <span className="ml-auto text-sm font-normal text-gray-500">
                      {comments.length}{' '}
                      {comments.length === 1 ? 'commentaire' : 'commentaires'}
                    </span>
                  </h2>
                </div>

                <div className="p-6">
                  {/* Liste des commentaires */}
                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                    {comments.length === 0 ? (
                      <div className="text-center py-12">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        <p className="mt-3 text-gray-500">
                          Aucun commentaire pour le moment
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Soyez le premier à ajouter un commentaire
                        </p>
                      </div>
                    ) : (
                      comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="group relative bg-gray-50 rounded-lg p-4 transition-all duration-200 hover:bg-gray-100 hover:shadow-md"
                        >
                          {/* Indicateur coloré à gauche */}
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-400 to-green-600 rounded-l-lg" />

                          {/* Contenu du commentaire */}
                          <div className="pl-3">
                            <p className="text-gray-900 leading-relaxed pr-8">
                              {comment.text}
                            </p>

                            {/* Métadonnées */}
                            <div className="flex items-center gap-3 mt-3 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                  />
                                </svg>
                                <span className="font-medium">
                                  {comment.admin}
                                </span>
                              </div>

                              <span className="text-gray-300">•</span>

                              <div className="flex items-center gap-1">
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <span>
                                  {comment.createdAt
                                    ? new Date(
                                        comment.createdAt
                                      ).toLocaleString('fr-FR', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })
                                    : 'Date inconnue'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Bouton de suppression */}
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="absolute top-4 right-4 p-1.5 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-600 hover:bg-red-50 rounded-md transition-all duration-200"
                            aria-label="Supprimer le commentaire"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Formulaire d'ajout de commentaire */}
                  <div className="border-t border-gray-200 pt-6">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleAddComment();
                      }}
                    >
                      <div className="relative">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Ajouter un commentaire interne..."
                          className="w-full p-4 pr-12 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                          rows={3}
                          aria-label="Nouveau commentaire"
                        />

                        {/* Indicateur de caractères (optionnel) */}
                        <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                          {newComment.length > 0 &&
                            `${newComment.length} caractères`}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <p className="text-xs text-gray-500">
                          Les commentaires sont visibles uniquement en interne
                        </p>

                        <button
                          type="submit"
                          disabled={!newComment.trim()}
                          className="px-5 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          Ajouter
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* En-tête avec dégradé */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Documents
                      <span className="ml-auto text-sm font-normal text-gray-500">
                        {documents.length}{' '}
                        {documents.length === 1 ? 'fichier' : 'fichiers'}
                      </span>
                    </h2>

                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      ref={fileInputRef}
                    />
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Ajouter un document</span>
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {documents.length === 0 ? (
                    <div className="text-center py-12">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="mt-3 text-gray-500">
                        Aucun document uploadé
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Commencez par ajouter des fichiers
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="group relative bg-gray-50 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex items-center justify-between">
                            {/* Infos du document */}
                            <div className="flex items-center gap-4">
                              {/* Icône du type de fichier */}
                              <div className="p-3 bg-white rounded-lg border border-gray-200 group-hover:border-gray-300 transition-colors duration-200">
                                <FileText className="h-6 w-6 text-gray-500" />
                              </div>

                              <div>
                                <p className="font-medium text-gray-900">
                                  {doc.name}
                                </p>
                                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                      />
                                    </svg>
                                    {doc.uploadDate
                                      ? formatActivityDate(doc.uploadDate)
                                      : 'Date inconnue'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1">
                              <button
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-all duration-200"
                                title="Aperçu"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-all duration-200"
                                onClick={() => downloadFile(doc.url, doc.name)}
                                title="Télécharger"
                              >
                                <Download className="h-4 w-4" />
                              </button>
                              <button
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-all duration-200"
                                onClick={() => downloadFile(doc.url, doc.name)}
                                title="Supprimer"
                              >
                                <Trash className="h-4 w-4 hover:text-red-700" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* En-tête avec dégradé */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Historique des activités
                    <span className="ml-auto text-sm font-normal text-gray-500">
                      {activities.length}{' '}
                      {activities.length === 1 ? 'activité' : 'activités'}
                    </span>
                  </h2>
                </div>

                <div className="p-6">
                  {/* Liste des activités avec timeline */}
                  {activities.length === 0 ? (
                    <div className="text-center py-12">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <p className="mt-3 text-gray-500">
                        Aucune activité enregistrée
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Les activités apparaîtront ici
                      </p>
                    </div>
                  ) : (
                    <div className="relative">
                      {/* Ligne de timeline verticale */}
                      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

                      <div className="space-y-6">
                        {activities.map((activity, index) => (
                          <div
                            key={activity.id}
                            className="relative flex items-start group"
                          >
                            {/* Point de timeline avec animation */}
                            <div className="relative z-10 flex-shrink-0">
                              <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full border-4 border-gray-200 group-hover:border-green-500 transition-colors duration-200">
                                <div
                                  className={`p-2 rounded-full ${getActivityColor(
                                    activity.type || 'default'
                                  )}`}
                                >
                                  {getActivityIcon(activity.type || 'default')}
                                </div>
                              </div>

                              {/* Badge "Nouveau" pour les activités récentes (optionnel) */}
                              {isRecentActivity(activity.timestamp) && (
                                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs font-medium text-white bg-red-500 rounded-full">
                                  New
                                </span>
                              )}
                            </div>

                            {/* Contenu de l'activité */}
                            <div className="ml-4 flex-1 pb-6">
                              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:shadow-md transition-all duration-200">
                                {/* Description de l'activité */}
                                <p className="font-medium text-gray-900 leading-relaxed">
                                  {activity.description}
                                </p>

                                {/* Métadonnées */}
                                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                  {/* Date et heure */}
                                  <div className="flex items-center gap-1">
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                      />
                                    </svg>
                                    <span>
                                      {activity.timestamp
                                        ? formatActivityDate(activity.timestamp)
                                        : 'Date inconnue'}
                                    </span>
                                  </div>

                                  {/* Auteur */}
                                  {activity.author && (
                                    <>
                                      <span className="text-gray-300">•</span>
                                      <div className="flex items-center gap-1">
                                        <svg
                                          className="w-4 h-4"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                          />
                                        </svg>
                                        <span className="font-medium">
                                          {activity.author}
                                        </span>
                                      </div>
                                    </>
                                  )}

                                  {/* Type d'activité (optionnel) */}
                                  {activity.type && (
                                    <>
                                      <span className="text-gray-300">•</span>
                                      <span
                                        className={`px-2 py-1 text-xs font-medium rounded-full ${getActivityBadgeColor(
                                          activity.type
                                        )}`}
                                      >
                                        {getActivityTypeLabel(activity.type)}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Indicateur de fin de timeline */}
                      <div className="relative flex items-center justify-center mt-6">
                        <div className="absolute left-6 -top-6 bottom-0 w-0.5 bg-gradient-to-b from-gray-200 to-transparent h-6" />
                        <div className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
                          Fin de l'historique
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'metrics' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-6 text-gray-600">
                  Indicateurs personnalisés
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Indicateurs de rendement */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">
                      Rendement
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Maïs</span>
                        <span className="font-medium text-gray-600">
                          4.2 T/ha
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Riz</span>
                        <span className="font-medium text-gray-600">
                          3.8 T/ha
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Météo locale */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">
                      Météo locale
                    </h3>
                    <div className="flex items-center space-x-3">
                      <Cloud className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-600">28°C</p>
                        <p className="text-sm text-gray-600">
                          Partiellement nuageux
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Alertes */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Alertes</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-orange-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm ">Risque de sécheresse</span>
                      </div>
                    </div>
                  </div>

                  {/* Performance saisonnière */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">
                      Performance saisonnière
                    </h3>
                    <div className="flex items-center space-x-2 text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm">+12% vs saison dernière</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar avec actions rapides */}
          <div className="space-y-6">
            {/* Actions rapides */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Actions rapides
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setActiveTab('comments')}
                  className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <FileText className="h-5 w-5 text-green-600" />
                  <span className="text-gray-600">Ajouter une note</span>
                </button>
                <button
                  onClick={() => setActiveTab('documents')}
                  className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <Upload className="h-5 w-5 text-purple-600" />
                  <span className="text-gray-600">Ajouter un document</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  <span className="text-gray-600">Planifier une visite</span>
                </button>
              </div>
            </div>

            {/* Résumé rapide */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Résumé</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Messages non lus</span>
                  <span className="font-medium text-blue-600">2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Documents</span>
                  <span className="font-medium text-gray-600">
                    {documents.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dernière activité</span>
                  <span className="font-medium text-gray-600">Aujourd'hui</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Statut</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    Actif
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
