'use client';

import React, { useState, useEffect } from 'react';
import {
  Globe,
  MapPin,
  Home,
  Building,
  Plus,
  Search,
  Check,
  X,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Map,
  Navigation,
  Flag,
  TreePine,
  Mountain,
  AlertCircle,
  Video,
  Share2,
  Play,
  Warehouse,
  Activity,
  Tractor,
  ShoppingCart,
  Clock,
  Users,
  Star,
  Filter,
  ChevronDown,
  Eye,
  BookOpen,
  Award,
  Languages,
  Download,
  Heart,
  VideoIcon,
  Timer,
  StarHalf,
  Trash,
  Trash2,
  Edit2,
} from 'lucide-react';
import VideoModal from '@/app/navigation/VideoModal/VideoModal';
import {
  createVideo,
  getAllVideos,
  deleteVideoById,
  updateVideo
} from '../../../../../../api/video';

type TutorialVideo = {
  id: string;
  titre: string;
  iframe: string;
  duree: number;
  formateur: string;
  langue: string;
  description?: string;
  difficulte: string;
  tags?: string[];
  // champ calculé
  thumbnail?: string | null;
};

export default function LocationManagement() {
  const [activeTab, setActiveTab] = useState('country');
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videos, setVideos] = useState<TutorialVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVideo, setEditingVideo] = useState<TutorialVideo | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await getAllVideos();
        const data: TutorialVideo[] = (await res.json?.()) ?? res;

        // enrichir chaque vidéo avec une miniature
        const withThumb = data.map((v) => ({
          ...v,
          thumbnail: getYoutubeThumbnail(v.iframe) ?? null, // on génère ici
        }));

        setVideos(withThumb);
        console.log('Vidéos reçues :', withThumb);
      } catch (err) {
        console.error('Erreur chargement vidéos ❌', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  function toYoutubeEmbed(url: string): string {
    try {
      const u = new URL(url);

      if (u.hostname.includes('youtube.com')) {
        const id = u.searchParams.get('v');
        if (id) return `https://www.youtube.com/embed/${id}`;
        if (u.pathname.includes('/embed/')) return url; // déjà embed
      }

      if (u.hostname === 'youtu.be') {
        const id = u.pathname.slice(1);
        return `https://www.youtube.com/embed/${id}`;
      }

      return url; // si ce n’est pas YouTube, on retourne tel quel
    } catch {
      return url;
    }
  }

  function getYoutubeThumbnail(
    url: string,
    size: 'default' | 'hq' | 'mq' | 'sd' | 'max' = 'hq'
  ) {
    try {
      const urlObj = new URL(url);

      // si ce n'est pas youtube → on ignore
      if (
        !urlObj.hostname.includes('youtube.com') &&
        urlObj.hostname !== 'youtu.be'
      ) {
        return null;
      }

      let videoId: string | null = null;

      // cas: https://www.youtube.com/watch?v=VIDEO_ID
      if (urlObj.hostname.includes('youtube.com')) {
        videoId = urlObj.searchParams.get('v');
        if (!videoId && urlObj.pathname.includes('/embed/')) {
          videoId = urlObj.pathname.split('/embed/')[1];
        }
      }

      // cas: https://youtu.be/VIDEO_ID
      if (urlObj.hostname === 'youtu.be') {
        videoId = urlObj.pathname.slice(1);
      }

      if (!videoId) return null;

      const sizes: Record<string, string> = {
        default: `https://img.youtube.com/vi/${videoId}/default.jpg`,
        hq: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        mq: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        sd: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
        max: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      };

      return sizes[size];
    } catch {
      return null; // URL invalide → on ignore aussi
    }
  }

  const secondsToTimecode = (duree: number) => {
    if (!Number.isFinite(duree) || duree <= 0) return '0:00';
    const total = Math.floor(duree);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const ss = String(s).padStart(2, '0');
    if (h > 0) {
      const mm = String(m).padStart(2, '0');
      return `${h}:${mm}:${ss}`;
    }
    return `${m}:${ss}`;
  };

  // 2) Somme des durées de toutes les vidéos -> "xh xm"
  const videoTotalLength = () => {
    const totalSec = videos.reduce((acc, v) => acc + (v?.duree ?? 0), 0);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    // format demandé: "xh xm" (ex: "2h 5m" ou "0h 42m")
    return `${h}h ${m}m`;
  };

  // 3) Moyenne des notes (note/5) de toutes les vidéos
  const videoMoyenneRate = () => {
    if (!videos.length) return 0;
    const sum = videos.reduce((acc, v) => acc + (v?.note ?? 0), 0);
    return Number((sum / videos.length).toFixed(2)); // ex: 3.67
  };

  // 4) Nombre de vidéos
  const numberOfVideo = () => videos.length;

  const filteredVideos = videos.filter((video) => {
    const matchesCategory =
      selectedCategory === 'all' || video?.category === selectedCategory;
    const matchesSearch =
      video.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'debutant':
        return 'bg-green-100 text-green-700';
      case 'intermediaire':
        return 'bg-yellow-100 text-yellow-700';
      case 'avance':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    try {
      await deleteVideoById(String(videoId));
      setVideos((prev) => prev.filter((f) => f.id !== videoId));
      console.log('Vidéo supprimé');
    } catch (err) {
      console.error('Erreur suppression vidéo :', err);
    }
  };

  const handleEditVideo = (videoId: string) => {
    const v = videos.find((x) => x.id === videoId) || null;
    setEditingVideo(v); // ouvre la modal d'édition (cf rendu plus bas)
  };

  const handleSaveNewVideo = async (payload: Omit<Video, 'id'>) => {
    const created = await createVideo(payload);
    setVideos((prev) => [created, ...prev]);
  };

  const handleUpdateVideo = async (payload: Omit<Video, 'id'>) => {
    if (!editingVideo) return;
    const updated = await updateVideo(editingVideo.id, payload);
    setVideos((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
    setEditingVideo(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec gradient */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 pb-9">
        <div className=" bg-opacity-10">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                  <MapPin className="w-8 h-8" />
                  Gestion des Vidéos
                </h1>
                <p className="text-blue-100">
                  Ajoutez et gérez les vidéos postées pour guider les fermiers
                </p>
              </div>
              <button
                onClick={() => setShowAddVideo(true)}
                className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Ajouter une video
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              label: 'Vidéos disponibles',
              count: numberOfVideo(),
              icon: VideoIcon,
              color: 'blue',
              change: '+1',
            },
            {
              label: 'Durée totale',
              count: videoTotalLength(),
              icon: Timer,
              color: 'green',
              change: '+3',
            },
            {
              label: 'Formateurs',
              count: '8',
              icon: Users,
              color: 'purple',
              change: '+5',
            },
            {
              label: 'Note moyenne',
              count: videoMoyenneRate(),
              icon: Star,
              color: 'orange',
              change: '+12',
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-14 h-14 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-2xl flex items-center justify-center`}
                >
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900">{stat.count}</h3>
              <p className="text-gray-600 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 mt-8">
        {/* Tabs et recherche */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par titre, description, formateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Contenu principal - Vue hiérarchique */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Video className="w-5 h-5 text-blue-600" />
              Guides Vidéo
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all group"
                >
                  {/* Thumbnail avec overlay de lecture */}
                  <div
                    className="relative cursor-pointer"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <div className="aspect-video bg-gray-200 relative overflow-hidden">
                      {video.thumbnail ? (
                        <img
                          src={video.thumbnail}
                          alt={video.titre}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <span className="text-gray-400 text-sm">
                            Pas de miniature
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/90 backdrop-blur rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="h-8 w-8 text-green-600 ml-1" />
                        </div>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(
                          video.difficulte
                        )}`}
                      >
                        {video.difficulte}
                      </span>
                      <span className="bg-black/70 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        {secondsToTimecode(video.duree)}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        {video.langue}
                      </span>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-800 leading-tight">
                        {video.titre}
                      </h3>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Edit2
                          className="h-4 w-4 cursor-pointer hover:text-blue-500"
                          onClick={() => handleEditVideo(video.id)}
                        />
                        <Trash2
                          className="h-4 w-4 cursor-pointer hover:text-red-500"
                          onClick={() => handleDeleteVideo(video.id)}
                        />
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {video.description}
                    </p>

                    {/* Informations */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {video.vues}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        {video.note}
                      </div>
                    </div>

                    {/* Formateur */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {video.formateur}
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {video.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedVideo(video)}
                        className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Play className="h-4 w-4" />
                        Regarder
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message si aucune vidéo */}
            {filteredVideos.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Aucune vidéo trouvée
                </h3>
                <p className="text-gray-600 mb-4">
                  Essayez de modifier vos critères de recherche
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}

            {/* Modal Vidéo */}
            {selectedVideo && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                  {/* Header du modal */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${
                          selectedVideo.category === 'fields'
                            ? 'from-green-400 to-green-600'
                            : selectedVideo.category === 'stocks'
                            ? 'from-blue-400 to-blue-600'
                            : selectedVideo.category === 'activities'
                            ? 'from-orange-400 to-orange-600'
                            : selectedVideo.category === 'equipment'
                            ? 'from-purple-400 to-purple-600'
                            : 'from-red-400 to-red-600'
                        } rounded-xl flex items-center justify-center text-white`}
                      >
                        <Play className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">
                          {selectedVideo.titre}
                        </h2>
                        <p className="text-gray-600">
                          Par {selectedVideo.formateur}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedVideo(null)}
                      className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                    >
                      <X className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>

                  {/* Contenu du modal */}
                  <div className="grid lg:grid-cols-3 gap-6 p-6">
                    {/* Player vidéo */}
                    <div className="lg:col-span-2">
                      <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden">
                        <iframe
                          src={`${toYoutubeEmbed(
                            selectedVideo.iframe
                          )}?autoplay=1`}
                          title={selectedVideo.titre}
                          className="w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>

                      {/* Description */}
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                          Description
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {selectedVideo.description}
                        </p>
                      </div>
                    </div>

                    {/* Sidebar informations */}
                    <div className="space-y-6">
                      {/* Stats */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="font-semibold text-gray-800 mb-4">
                          Informations
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Durée</span>
                            <span className="font-medium">
                              {secondsToTimecode(selectedVideo.duree)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Vues</span>
                            <span className="font-medium">
                              {selectedVideo.vues}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Note</span>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="font-medium">
                                {selectedVideo.note}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Langue</span>
                            <span className="font-medium">
                              {selectedVideo.langue}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Niveau</span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(
                                selectedVideo.difficulte
                              )}`}
                            >
                              {selectedVideo.difficulte}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">
                          Mots-clés
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedVideo.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                            >
                              {tag}
                            </span>
                          ))}
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

      {showAddVideo && (
        <VideoModal
          mode="create"
          onSubmit={handleSaveNewVideo}
          onClose={() => setShowAddVideo(false)}
        />
      )}

      {/* Modal d'édition */}
      {editingVideo && (
        <VideoModal
          mode="edit"
          initialValues={{
            iframe: editingVideo.iframe,
            duree: editingVideo.duree,
            formateur: editingVideo.formateur,
            langue: editingVideo.langue,
            titre: editingVideo.titre,
            description: editingVideo.description ?? '',
            difficulte: editingVideo.difficulte,
            tags: editingVideo.tags.join(', '),
          }}
          onSubmit={handleUpdateVideo}
          onClose={() => setEditingVideo(null)}
        />
      )}

      {/* Toast de succès */}
      {showSuccess && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-in">
          <Check className="w-6 h-6" />
          <p className="font-medium">Vidéo ajoutée avec succès !</p>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
