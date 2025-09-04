'use client';

import React, { useState, useEffect } from 'react';
import {
  Play,
  MapPin,
  Warehouse,
  Activity,
  Tractor,
  ShoppingCart,
  Clock,
  Users,
  Star,
  Filter,
  Search,
  ChevronDown,
  Eye,
  BookOpen,
  Award,
  Languages,
  Download,
  Heart,
  Share2,
  X,
} from 'lucide-react';
import { getAllVideos } from '../../../../../../api/video';

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

const VideoGuidePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videos, setVideos] = useState<TutorialVideo[]>([]);
  const [loading, setLoading] = useState(true);

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

  const categories = [
    { id: 'all', label: 'Toutes les vidéos', icon: BookOpen, count: 15 },
    { id: 'fields', label: 'Gestion des Champs', icon: MapPin, count: 4 },
    { id: 'stocks', label: 'Gestion du Stock', icon: Warehouse, count: 3 },
    {
      id: 'activities',
      label: 'Activités Agricoles',
      icon: Activity,
      count: 4,
    },
    { id: 'equipment', label: 'Équipements', icon: Tractor, count: 2 },
    { id: 'support', label: 'Aide & Support', icon: ShoppingCart, count: 2 },
  ];

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="bg-white/20 backdrop-blur rounded-xl p-3">
                <Play className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-bold">Guides Vidéo</h1>
            </div>
            <p className="text-xl text-green-50 mb-8 max-w-3xl mx-auto">
              Apprenez à utiliser votre plateforme agricole avec nos tutoriels
              vidéo en français et wolof
            </p>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <Languages className="h-8 w-8 text-yellow-300 mx-auto mb-2" />
                <div className="font-semibold">Multilingue</div>
                <div className="text-sm text-green-50">Français & Wolof</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <Award className="h-8 w-8 text-yellow-300 mx-auto mb-2" />
                <div className="font-semibold">Formateurs Experts</div>
                <div className="text-sm text-green-50">
                  Agriculteurs expérimentés
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <Download className="h-8 w-8 text-yellow-300 mx-auto mb-2" />
                <div className="font-semibold">Téléchargeable</div>
                <div className="text-sm text-green-50">Regardez hors ligne</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une vidéo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-5 w-5" />
              Filtres
              <ChevronDown
                className={`h-4 w-4 transform transition-transform ${
                  showFilters ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>

          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {category.label}
                      <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Statistiques */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Play className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {videos.length}
                </div>
                <div className="text-sm text-gray-600">Vidéos disponibles</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{videoTotalLength()}</div>
                <div className="text-sm text-gray-600">Durée totale</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">8</div>
                <div className="text-sm text-gray-600">Formateurs</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{videoMoyenneRate()}</div>
                <div className="text-sm text-gray-600">Note moyenne</div>
              </div>
            </div>
          </div>
        </div>

        {/* Grille des vidéos */}
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
                <h3 className="text-lg font-bold text-gray-800 mb-3 leading-tight">
                  {video.titre}
                </h3>

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
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Heart className="h-4 w-4 text-gray-600" />
                  </button>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Share2 className="h-4 w-4 text-gray-600" />
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
                      src={`${toYoutubeEmbed(selectedVideo.iframe)}?autoplay=1`}
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

                  {/* Actions */}
                  <div className="space-y-3">
                    <button className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                      <Heart className="h-4 w-4" />
                      Ajouter aux favoris
                    </button>
                    <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                      <Share2 className="h-4 w-4" />
                      Partager la vidéo
                    </button>
                  </div>

                  {/* Support */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      Besoin d'aide ?
                    </h4>
                    <p className="text-blue-700 text-sm mb-3">
                      Contactez {selectedVideo.formateur} pour des questions
                      spécifiques sur cette vidéo.
                    </p>
                    <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                      Contacter le formateur
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Call to action */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-8 text-white text-center mt-12">
          <h2 className="text-2xl font-bold mb-4">
            Une question sur les vidéos ?
          </h2>
          <p className="text-lg text-green-50 mb-6">
            Notre équipe de formation est là pour vous aider
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
              💬 Contacter un formateur
            </button>
            <button className="border-2 border-white/30 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
              <a
                href="https://calendar.app.google/KJUjgwsuZuaqrVsU9"
                target="_blank"
              >
                📅 Demander une session personnalisée
              </a>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoGuidePage;
