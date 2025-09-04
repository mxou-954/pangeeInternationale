import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Warehouse,
  Activity,
  Tractor,
  ShoppingCart,
  CheckCircle2,
  Circle,
  Info,
  Play,
  BookOpen,
  Users,
  Download,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Clock,
  CheckCheck,
} from 'lucide-react';
import { handleClientScriptLoad } from 'next/script';
import {
  createGuideModule,
  getGuideByFarmer,
  updateGuideModule,
} from '../../../../../../../api/guide';

const SimpleFarmGuide = ({ setActiveTab }) => {
  type ModuleId = 'fields' | 'stocks' | 'activities' | 'equipements' | 'ask';

  const params = useParams<{ farmerId: string }>();
  const farmerId = params.farmerId;
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [activeModule, setActiveModule] = useState(null);
  const [isModule, setIsModule] = useState();
  const [completed, setCompleted] = useState<Record<ModuleId, boolean>>({
    fields: false,
    stocks: false,
    activities: false,
    equipements: false,
    ask: false,
  });

  const toCompletionMap = (arr: any[]) =>
    Object.fromEntries(arr.map((it) => [it.module, Boolean(it.finish)]));

  useEffect(() => {
    if (!farmerId) return;
    const ac = new AbortController();

    (async () => {
      try {
        const data = await getGuideByFarmer(String(farmerId), ac.signal);
        // 1) garder le retour brut si tu en as besoin
        setIsModule(data);
        // 2) alimenter la map des modules complétés
        setCompleted((prev) => ({ ...prev, ...toCompletionMap(data) }));
      } catch (err) {
        if (!ac.signal.aborted) console.error('Erreur fetch /guide :', err);
      }
    })();

    return () => ac.abort();
  }, [farmerId]);

  const toggleStep = (stepId) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
    }
    setCompletedSteps(newCompleted);
  };

  const toggleModule = (moduleId) => {
    setActiveModule(activeModule === moduleId ? null : moduleId);
  };

  const quickActions = useMemo(
    () => [
      {
        icon: Play,
        title: 'Démarrage rapide',
        description: 'Commencer en 5 minutes',
        action: 'Commencer',
        linking: `/navigation/dashboard/${farmerId}`, // ✅ backticks
        external: false,
      },
      {
        icon: BookOpen,
        title: 'Guide vidéo',
        description: 'Tutoriels en français et wolof',
        action: 'Regarder',
        linking: `/navigation/dashboard/${farmerId}/videosGuide`,
        external: false,
      },
      {
        icon: Users,
        title: 'Formation',
        description: 'Apprendre avec un formateur',
        action: 'Contacter',
        linking: 'https://calendar.app.google/KJUjgwsuZuaqrVsU9',
        external: true,
      },
      {
        icon: Download,
        title: 'Manuel',
        description: 'Guide imprimable PDF',
        action: 'Télécharger',
        linking: `/navigation/dashboard/${farmerId}`,
        external: false,
      },
    ],
    [farmerId]
  );

  const modules = [
    {
      id: 'fields',
      label: 'Champs',
      icon: MapPin,
      color: 'bg-green-100 text-green-700',
      activeColor: 'bg-green-500 text-white',
      description: 'Enregistrer vos parcelles',
      steps: [
        'Aller dans l\'onglet "Champs" 🗺️',
        'Cliquer sur "Créer un champ"',
        'Ajouter le nom et la taille',
        'Créer des zones dans le champ',
        'Noter le type de culture',
      ],
    },
    {
      id: 'stocks',
      label: 'Gestion du stock',
      icon: Warehouse,
      color: 'bg-blue-100 text-blue-700',
      activeColor: 'bg-blue-500 text-white',
      description: 'Suivre vos produits',
      steps: [
        'Aller dans "Gestion du stock" 📦',
        'Ajouter vos semences et engrais',
        'Noter les quantités disponibles',
        'Le stock diminue automatiquement',
        "Recevoir des alertes quand c'est bientôt fini",
      ],
    },
    {
      id: 'activities',
      label: 'Activités',
      icon: Activity,
      color: 'bg-orange-100 text-orange-700',
      activeColor: 'bg-orange-500 text-white',
      description: 'Noter vos travaux',
      steps: [
        'Aller dans "Activités" ⚡',
        'Créer une nouvelle activité',
        'Choisir le champ concerné',
        'Noter les produits utilisés',
        'Enregistrer le travail fait',
      ],
    },
    {
      id: 'equipements',
      label: 'Gestion des équipements',
      icon: Tractor,
      color: 'bg-purple-100 text-purple-700',
      activeColor: 'bg-purple-500 text-white',
      description: 'Entretenir vos outils',
      steps: [
        'Aller dans "Équipements" 🚜',
        'Ajouter vos machines et outils',
        "Programmer l'entretien",
        "Noter l'état des équipements",
        'Suivre les réparations',
      ],
    },
    {
      id: 'ask',
      label: 'Demandes',
      icon: ShoppingCart,
      color: 'bg-red-100 text-red-700',
      activeColor: 'bg-red-500 text-white',
      description: "Demander de l'aide",
      steps: [
        'Aller dans "Demandes" 🛒',
        'Expliquer votre problème',
        "Choisir le type d'aide",
        'Envoyer la demande',
        'Recevoir une réponse rapide',
      ],
    },
  ];

  const totalCount = modules.length;
  const completedCount = modules.filter(
    (m) => completed[m.id as ModuleId]
  ).length;
  const completionRate = Math.round((completedCount / totalCount) * 100);

  const handleSubmit = async (moduleId: string) => {
    // toggle de l’état courant
    const finish = !(isModule?.finish ?? false);

    try {
      const data = isModule
        ? await updateGuideModule(String(farmerId), moduleId, { finish }) // PATCH
        : await createGuideModule(String(farmerId), {
            module: moduleId,
            finish,
          }); // POST

      // data doit ressembler à { module, finish }
      setIsModule(data);
      setIsModule((prev: any) => ({ ...prev, [moduleId]: { module: moduleId, finish } }));
      console.log('Module MAJ :', data);
    } catch (err) {
      console.error('Erreur API:', err);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 rounded-xl border">
      {/* En-tête simple */}
      <div className="rounded-t-xl bg-white shadow-sm border-b-4 border-green-500">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              🌾 Guide d'utilisation - Gestion Agricole
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Apprenez à utiliser votre nouvelle plateforme de gestion agricole
              étape par étape
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Actions rapides */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all group"
              >
                <Icon className="h-8 w-8 text-green-600 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-gray-800 mb-2">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {action.description}
                </p>

                {action.external ? (
                  <a
                    href={action.linking}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 font-medium text-sm flex items-center gap-2 group-hover:gap-3 transition-all"
                  >
                    {action.action} <ArrowRight className="h-4 w-4" />
                  </a>
                ) : (
                  <Link
                    href={action.linking}
                    className="text-green-600 font-medium text-sm flex items-center gap-2 group-hover:gap-3 transition-all"
                  >
                    {action.action} <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Overview - Style navigation */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Votre progression
            </h2>
            <p className="text-gray-600">
              Cliquez sur chaque onglet pour apprendre à l'utiliser
            </p>
          </div>

          {/* Barre de progression générale */}
          <div className="bg-gray-100 rounded-full h-6 mb-8 relative overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-400 to-green-600 h-6 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-4"
              style={{ width: `${completionRate}%` }}
            >
              {completionRate > 20 && (
                <span className="text-white text-sm font-bold">
                  {completionRate}%
                </span>
              )}
            </div>
            {completionRate <= 20 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-600 text-sm font-bold">
                  {completionRate}%
                </span>
              </div>
            )}
          </div>

          <div className="text-center mb-8">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {completedCount} / {totalCount}
            </div>
            <p className="text-gray-600">
              {completedCount === 0 && 'Commencez par le premier onglet'}
              {completedCount > 0 &&
                completedCount < totalCount &&
                'Continuez, vous progressez bien !'}
              {completedCount === totalCount &&
                '🎉 Félicitations ! Vous maîtrisez tout !'}
            </p>
          </div>

          {/* Navigation style onglets */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {modules.map((module) => {
              const Icon = module.icon;
              const isCompleted = !!completed[module.id as ModuleId];
              const isActive = activeModule === module.id;

              return (
                <button
                  key={module.id}
                  onClick={() => toggleModule(module.id)}
                  className={`flex items-center gap-3 px-6 py-4 rounded-xl font-medium transition-all border-2 min-w-[200px] ${
                    isActive
                      ? module.activeColor +
                        ' border-current shadow-lg transform scale-105'
                      : isCompleted
                      ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                      : module.color + ' border-current hover:shadow-md'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="flex-1 text-left">{module.label}</span>
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                  {isActive ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Détails du module actif */}
          {activeModule && (
            <div className="border-t border-gray-100 pt-8">
              {modules.map((module) => {
                if (module.id !== activeModule) return null;

                const Icon = module.icon;
                const isCompleted = !!completed[module.id as ModuleId];

                return (
                  <div key={module.id} className="text-center">
                    <div
                      className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl ${module.color} mb-6`}
                    >
                      <Icon className="h-6 w-6" />
                      <h3 className="text-xl font-bold">{module.label}</h3>
                    </div>

                    <p className="text-gray-600 text-lg mb-8">
                      {module.description}
                    </p>

                    <div className="bg-gray-50 rounded-xl p-6 max-w-2xl mx-auto">
                      <h4 className="font-semibold text-gray-800 mb-4 flex items-center justify-center gap-2">
                        <CheckCheck className="h-5 w-5 text-green-600" />
                        Étapes à suivre
                      </h4>

                      <div className="space-y-3 text-left">
                        {module.steps.map((step, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 bg-white rounded-lg"
                          >
                            <div className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <span className="text-gray-700">{step}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => handleSubmit(module.id as ModuleId)}
                        className={`mt-6 px-8 py-3 rounded-xl font-semibold transition-all ${
                          completed[module.id as ModuleId]
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        {completed[module.id as ModuleId]
                          ? '✓ Terminé !'
                          : 'Marquer comme terminé'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Conseil d'utilisation */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <Info className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">💡 Conseil</h3>
              <p className="text-blue-700">
                Commencez par créer vos champs, puis ajoutez votre stock.
                Ensuite vous pourrez enregistrer vos activités et le stock se
                mettra à jour automatiquement !
              </p>
            </div>
          </div>
        </div>

        {/* Résumé de progression */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border-l-4 border-green-500">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {completedCount}
                </div>
                <div className="text-sm text-gray-600">Modules terminés</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border-l-4 border-blue-500">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {(totalCount - completedCount) * 5}
                </div>
                <div className="text-sm text-gray-600">Minutes restantes</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border-l-4 border-purple-500">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {completionRate}%
                </div>
                <div className="text-sm text-gray-600">Progression totale</div>
              </div>
            </div>
          </div>
        </div>

        {/* Message d'encouragement */}
        {completedCount === totalCount ? (
          <div className="bg-green-500 text-white rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">🎉 Excellent travail !</h3>
            <p className="text-lg mb-6">
              Vous avez terminé la configuration ! Vous pouvez maintenant
              utiliser votre plateforme pour gérer votre exploitation.
            </p>
            <button
              onClick={() => setActiveTab('fields')}
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Commencer à utiliser
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Besoin d'aide ?
            </h3>
            <p className="text-gray-600 mb-6">
              Notre équipe est là pour vous accompagner dans l'utilisation de
              votre plateforme
            </p>
            <div className="flex justify-center gap-4">
              <button className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors">
                💬 Contacter le support
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                <a
                  href="https://calendar.app.google/KJUjgwsuZuaqrVsU9"
                  target="_blank"
                >
                  📞 Demander une formation
                </a>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleFarmGuide;
