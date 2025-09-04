'use client';

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import { useParams } from 'next/navigation';
import NewFieldModal from '@/app/components/newField/newField';
import {
  Calendar,
  Droplets,
  Sprout,
  TrendingUp,
  MapPin,
  Sun,
  Cloud,
  Thermometer,
  BarChart3,
  PieChart,
  Settings,
  Bell,
  Plus,
  Edit,
  Trash2,
  Save,
  Eye,
  Target,
  Leaf,
  Wheat,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calculator,
  Download,
  Upload,
  Filter,
  icons,
  ShoppingCart,
  Warehouse,
  Tractor,
  Search,
  Package,
  Droplet,
  Snail,
  Shovel,
  Scissors,
  PillBottle,
  Info,
  Grid3X3,
  Mountain,
  Compass,
  Beaker,
  Shield,
  FileText,
  MoreVertical,
  ChevronRight,
  TreePine,
  XCircle,
  Database,
  CloudRain,
  Bug,
  Award,
  DollarSign,
  Gauge,
  Layers,
  Navigation,
  Home,
  Truck,
  History,
  ZoomIn,
  Zap,
  Edit2,
  ActivityIcon,
  User2,
  PoundSterling,
  CirclePoundSterling,
  IdCardLanyard,
  Group,
  FileJson,
} from 'lucide-react';
import {
  LineChart,
  Pie,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  AreaChart,
  Area,
  Label,
} from 'recharts';
import TeamMembersDisplay from './field/[fieldId]/components/membersHere/memberHere';
import InventoryDisplayPage from './components/showStocks/showStocks';
import EquipmentDisplayPage from './components/showEquipement/showEquipement';
import AgriculturalActivityModal from './field/[fieldId]/components/addActivities/addActivities';
import ZonesManagementModal from './field/[fieldId]/components/addAndShowZones/addAndShowZones';
import SimpleFarmGuide from './components/dashboard/dashboard';
import FieldDetailsModal from './field/[fieldId]/components/fieldDetails/fieldDetails';
import AddMemberModal from './field/[fieldId]/components/addMembers/addMembers';
import {
  createFieldForFarmer,
  deleteField,
  getFieldsByFarmer,
} from '../../../../../api/field';
import { getHarvestsFromFarmer } from '../../../../../api/harvests';
import { deleteMember, getMembersByFarmer } from '../../../../../api/members';
import { getAllStocks } from '../../../../../api/stocks';
import {
  deleteActivity,
  getActivitiesAllByFarmer,
} from '../../../../../api/activities';
import { getGuideByFarmer } from '../../../../../api/guide';
import Success from '../../admin/components/popup/success';
import Error from '../../admin/components/popup/error';

type EmploymentType = 'Permanent' | 'Saisonnier' | 'Temporaire' | 'Stagiaire';
type Department =
  | 'Production'
  | 'Élevage'
  | 'Maintenance'
  | 'Commercial'
  | 'Administration';
type Job =
  | 'Ouvrier agricole'
  | 'Tractoriste'
  | 'Responsable irrigation'
  | 'Chef de culture'
  | 'Responsable élevage'
  | 'Magasinier'
  | 'Commercial'
  | 'Comptable'
  | 'Superviseur'
  | 'Manager';

export type Member = {
  id: string;
  nom: string;
  poste: Job;
  departement: Department;
  typeEmploi: EmploymentType;
};

// === Options typées (toujours visibles dans les <select>) ===
const EMPLOYMENT_TYPES = [
  'Permanent',
  'Saisonnier',
  'Temporaire',
  'Stagiaire',
] as const satisfies readonly EmploymentType[];

const DEPARTMENTS = [
  'Production',
  'Élevage',
  'Maintenance',
  'Commercial',
  'Administration',
] as const satisfies readonly Department[];

const JOBS = [
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
] as const satisfies readonly Job[];

type Props = { members: Member[] };

const byId = (arr = []) =>
  Object.fromEntries(arr.map((x) => [String(x.id), x]));
const toObj = (val, dict, oldVal) => {
  if (!val) return oldVal ?? null;
  if (typeof val === 'string') return dict[val] ?? oldVal ?? { id: val };
  return val;
};

const AgriculturalDashboard = () => {
  const params = useParams<{ farmerId: string }>();
  const farmerId = params.farmerId;
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCategoryMembers, setSelectedCategoryMembers] = useState('all');
  const [weatherData, setWeatherData] = useState({
    temperature: 22,
    humidity: 65,
    precipitation: 12,
    windSpeed: 8,
    forecast: 'Ensoleillé',
  });

  const [showAddActivity, setShowAddActivity] = useState(false);
  const [flattenedActivity, setFlattenedActivity] = useState();
  const [showZonesModal, setShowZonesModal] = useState(false);
  const [selectedField, setSelectedField] = useState('');
  const [editingField, setEditingField] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showAddMembers, setShowAddMembers] = useState(false);

  const [fields, setFields] = useState([]);
  const [activities, setActivities] = useState([]);
  const [plantations, setPlantations] = useState([]);
  const [operators, setOperators] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [members, setMembers] = useState([]);

  const [selectedJob, setSelectedJob] = React.useState<Job | ''>('');
  const [selectedDept, setSelectedDept] = React.useState<Department | ''>('');
  const [selectedType, setSelectedType] = React.useState<EmploymentType | ''>(
    ''
  );

  const snapshotRef = useRef<any[] | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!farmerId) return;
    const ac = new AbortController();

    (async () => {
      try {
        const [f, p, o, s] = await Promise.all([
          getFieldsByFarmer(String(farmerId), { signal: ac.signal }),
          getHarvestsFromFarmer(String(farmerId), { signal: ac.signal }),
          getMembersByFarmer(String(farmerId), { signal: ac.signal }),
          getAllStocks(String(farmerId), { signal: ac.signal }),
        ]);
        if (ac.signal.aborted) return;

        setFields(f as any[]);
        setPlantations(p as any[]);
        setOperators(o as any[]);
        setStocks(s as any[]);
      } catch (err) {
        if (!ac.signal.aborted)
          console.error('Erreur chargement dashboard:', err);
      }
    })();

    return () => ac.abort();
  }, [farmerId]);

  useEffect(() => {
    if (!farmerId) return;
    const ac = new AbortController();

    (async () => {
      try {
        const data = await getMembersByFarmer(String(farmerId), {
          signal: ac.signal,
        });
        if (ac.signal.aborted) return;
        setMembers(data as any[]);
        console.log('Membres :', data);
      } catch (err) {
        if (!ac.signal.aborted) console.error('Erreur fetch activités:', err);
      }
    })();

    return () => ac.abort();
  }, [farmerId]);

  useEffect(() => {
    if (!farmerId) return;
    const ac = new AbortController();

    (async () => {
      try {
        const data = await getActivitiesAllByFarmer(String(farmerId), {
          signal: ac.signal,
        });
        if (ac.signal.aborted) return;
        setActivities(data as any[]);
        console.log('Activités :', data);
      } catch (err) {
        if (!ac.signal.aborted) console.error('Erreur fetch activités:', err);
      }
    })();

    return () => ac.abort();
  }, [farmerId]);

  const fieldsById = useMemo(() => byId(fields), [fields]);
  const plantationsById = useMemo(() => byId(plantations), [plantations]);
  const operatorsById = useMemo(() => byId(operators), [operators]);
  const stocksById = useMemo(() => byId(stocks), [stocks]);

  const openEdit = (activity) => {
    setFlattenedActivity({
      ...activity,
      field: activity.field?.id ?? activity.field, // -> ID pour le DTO
      plantation: activity.plantation?.id ?? activity.plantation,
      operator: activity.operator?.id ?? activity.operator,
      stock: activity.stock?.id ?? activity.stock,
    });
    setShowAddActivity(true);
  };

  const handleUpdateActivity = useCallback(
    (data) => {
      setActivities((prev) => {
        const ix = prev.findIndex((a) => a.id === data.id);
        const old = ix !== -1 ? prev[ix] : null;

        // ⚠️ ICI on merge en conservant les OBJETS relationnels
        const merged = {
          ...(old ?? {}),
          ...data, // peut contenir des IDs pour field/plantation/operator/stock
          field: toObj(data.field, fieldsById, old?.field),
          plantation: toObj(data.plantation, plantationsById, old?.plantation),
          operator: toObj(data.operator, operatorsById, old?.operator),
          stock: toObj(data.stock, stocksById, old?.stock),
        };

        if (ix === -1) return [merged, ...prev];
        const next = prev.slice();
        next[ix] = merged;
        return next;
      });
    },
    [fieldsById, plantationsById, operatorsById, stocksById]
  );

  useEffect(() => {
    if (!farmerId) return;
    const ac = new AbortController();

    (async () => {
      try {
        const data = await getFieldsByFarmer(String(farmerId), {
          signal: ac.signal,
        });
        if (ac.signal.aborted) return;
        setFields(data);
        // ⚠️ console.log(fields) ici afficherait l'ancien state.
        // Si tu veux voir le nouveau, loggue `data` (déjà fait) ou ajoute un effet sur [fields].
      } catch (err) {
        if (!ac.signal.aborted) console.error('Erreur fields:', err);
      }
    })();

    return () => ac.abort();
  }, [farmerId]);

  // b) Charger le guide et diriger vers l’onglet
  useEffect(() => {
    if (!farmerId) return;
    const ac = new AbortController();

    (async () => {
      try {
        const data = await getGuideByFarmer(String(farmerId), {
          signal: ac.signal,
        });
        if (ac.signal.aborted) return;

        console.log('Voici le retour des modules : ', data);

        const oneNotFinished = data.some((m: any) => m.finish === false);
        if (oneNotFinished) setActiveTab('dashboard');

        const allFinished =
          data.length > 0 && data.every((m: any) => m.finish === true);
        if (allFinished) setActiveTab('fields');
      } catch (err) {
        if (!ac.signal.aborted) console.error('Erreur guide:', err);
      }
    })();

    return () => ac.abort();
  }, [farmerId]);

  const handleNewField = async (fieldData: any) => {
    // on ignore farmerId venant du form
    const { farmerId: _ignored, ...cleanedField } = fieldData;

    try {
      const created = await createFieldForFarmer(
        String(farmerId),
        cleanedField,
        {
          successMessage: 'Champ créé avec succès.',
          errorMessage: 'Impossible de créer le champ.',
        }
      );
      setFields((prev) => [...prev, created]);
      console.log('Field créé :', created);
    } catch (err) {
      console.error('Erreur création field :', err);
    }
  };

  const handleRedirectionField = async (fieldId: string) => {
    window.location.href = `/navigation/dashboard/${farmerId}/field/${fieldId}`;
  };

  const [newActivity, setNewActivity] = useState({
    type: '',
    field: '',
    quantity: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [newField, setNewField] = useState({
    // Informations de base
    name: '',
    farmerId: farmerId,

    // Caractéristiques physiques
    size: '', // en hectares
    coordinates: {
      latitude: '',
      longitude: '',
    },
    address: '',
    altitude: '', // en mètres
    slope: '', // en pourcentage
    exposition: '', // Nord, Sud, Est, Ouest, Sud-Est, etc.

    // Caractéristiques du sol
    soilType: '', // Argileux, Sableux, Limoneux, Calcaire, etc.
    soilPH: '', // 0-14
    soilQuality: '', // Excellent, Bon, Moyen, Faible
    drainage: '', // Excellent, Bon, Moyen, Faible
    organicMatter: '', // en pourcentage
    lastSoilAnalysis: '', // date

    // Informations sur la culture
    cropType: '', // Blé, Maïs, Soja, Orge, etc.
    cropVariety: '', // variété spécifique
    plantingDate: '',
    expectedHarvestDate: '',
    rotationPlan: [], // array des cultures prévues sur plusieurs années

    // Infrastructure et équipements
    irrigationSystem: '', // Aspersion, Goutte-à-goutte, Gravitaire, Aucun
    irrigationCapacity: '', // L/h ou m³/h
    waterSource: '', // Puits, Rivière, Réseau, Réservoir
    fencing: false, // clôturé ou non
    storage: '', // présence de stockage sur place
    accessibility: '', // Excellente, Bonne, Difficile

    // Données historiques (si disponibles)
    previousCrops: [], // cultures des années précédentes
    averageYield: '', // rendement moyen historique en kg/ha
    lastPlowing: '',
    lastFertilization: '',
    previousTreatments: [],

    // Prévisions et budget
    expectedYield: '', // kg/ha espéré
    productionCost: '', // coût prévu par hectare
    expectedRevenue: '', // revenus espérés

    // Contraintes et risques
    climateRisks: [], // Gel, Grêle, Sécheresse, Inondation
    pestRisks: [], // risques de parasites connus
    diseaseHistory: [], // maladies observées précédemment

    // Informations légales et administratives
    ownershipType: '', // Propriété, Location, Fermage
    lease: {
      startDate: '',
      endDate: '',
      cost: '', // si location
    },
    certifications: [], // Bio, Label Rouge, AOP, etc.
    subsidiesEligible: [], // aides PAC, autres subventions

    // Métadonnées
    createdDate: new Date().toISOString().split('T')[0],
    status: 'planning', // planning, active, fallow, harvested
    notes: '',
    photos: [], // URLs des photos du champ

    // Objectifs et KPIs
    sustainabilityGoals: {
      waterReduction: '', // % de réduction visée
      chemicalReduction: '', // % de réduction pesticides/engrais
      carbonSequestration: '', // objectif carbone
      biodiversityIndex: '', // objectif biodiversité
    },
  });

  const categories = {
    all: {
      name: 'Toutes les catégories',
      icon: <Package className="w-4 h-4 text-gray-600" />,
      color: 'text-gray-600',
    },
    watering: {
      name: 'Arrosage',
      icon: <Droplet className="w-4 h-4 text-blue-500" />,
      color: 'text-blue-500',
    },
    pesticides: {
      name: 'Pesticides',
      icon: <Snail className="w-4 h-4 text-red-500" />,
      color: 'text-red-500',
    },
    fertilizer: {
      name: 'Engrais',
      icon: <Leaf className="w-4 h-4 text-green-600" />,
      color: 'text-green-600',
    },
    inspection: {
      name: 'Inspection',
      icon: <Eye className="w-4 h-4 text-indigo-500" />,
      color: 'text-indigo-500',
    },
    harvest: {
      name: 'Récolte',
      icon: <Wheat className="w-4 h-4 text-yellow-600" />,
      color: 'text-yellow-600',
    },
    sowing: {
      name: 'Semis',
      icon: <Shovel className="w-4 h-4 text-orange-500" />,
      color: 'text-orange-500',
    },
    pruning: {
      name: 'Taille',
      icon: <Scissors className="w-4 h-4 text-purple-500" />,
      color: 'text-purple-500',
    },
    treatment: {
      name: 'Traitement',
      icon: <PillBottle className="w-4 h-4 text-pink-500" />,
      color: 'text-pink-500',
    },
    soil_prep: {
      name: 'Préparation du sol',
      icon: <Tractor className="w-4 h-4 text-teal-600" />,
      color: 'text-teal-600',
    },
    Inconnu: {
      name: 'Inconnu',
      icon: <Info className="w-4 h-4 text-gray-400" />,
      color: 'text-gray-400',
    },
  };

  const categoriesMembers = {
    all: {
      name: 'Toutes les membres',
      icon: <User2 className="w-4 h-4 text-gray-600" />,
      color: 'text-gray-600',
    },
    job: {
      name: 'Poste',
      icon: <FileJson className="w-4 h-4 text-blue-500" />,
      color: 'text-blue-500',
    },
    departments: {
      name: 'Départements',
      icon: <Group className="w-4 h-4 text-red-500" />,
      color: 'text-red-500',
    },
    typeOfEmployment: {
      name: "Type d'emploi",
      icon: <IdCardLanyard className="w-4 h-4 text-green-600" />,
      color: 'text-green-600',
    },
  };

  const jobs = React.useMemo(
    () => Array.from(new Set(members.map((m) => m.poste))).sort(),
    [members]
  );
  const depts = React.useMemo(
    () => Array.from(new Set(members.map((m) => m.departement))).sort(),
    [members]
  );
  const types = React.useMemo(
    () => Array.from(new Set(members.map((m) => m.typeEmploi))).sort(),
    [members]
  );

  const filtered = React.useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return members.filter((m) => {
      const matchSearch =
        !q ||
        m.nom.toLowerCase().includes(q) ||
        m.poste.toLowerCase().includes(q) ||
        m.departement.toLowerCase().includes(q) ||
        m.typeEmploi.toLowerCase().includes(q);

      const matchJob = !selectedJob || m.poste === selectedJob;
      const matchDept = !selectedDept || m.departement === selectedDept;
      const matchType = !selectedType || m.typeEmploi === selectedType;

      return matchSearch && matchJob && matchDept && matchType;
    });
  }, [members, searchTerm, selectedJob, selectedDept, selectedType]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedJob('');
    setSelectedDept('');
    setSelectedType('');
  };

  const [annualPlan, setAnnualPlan] = useState({
    seeds: { planned: 500, used: 320, unit: 'kg', cost: 2500 },
    water: { planned: 15000, used: 9800, unit: 'L', cost: 450 },
    fuel: { planned: 800, used: 520, unit: 'L', cost: 1200 },
    pesticides: { planned: 120, used: 85, unit: 'kg', cost: 980 },
    fertilizers: { planned: 300, used: 210, unit: 'kg', cost: 1500 },
    labor: { planned: 200, used: 130, unit: 'h', cost: 2600 },
  });

  const ts = (d) => (d ? new Date(d).getTime() : 0); // 0 si pas de date
  const pickDate = (h) =>
    h.closedAt ?? h.harvestDate ?? h.plantingDate ?? h.createdAt ?? null;

  const [helpRequests, setHelpRequests] = useState([
    {
      id: 1,
      type: 'financial',
      status: 'pending',
      amount: 2500,
      reason: 'Achat équipement irrigation',
      date: '2024-07-15',
    },
    {
      id: 2,
      type: 'technical',
      status: 'approved',
      amount: 0,
      reason: 'Formation pesticides bio',
      date: '2024-07-10',
    },
  ]);

  const [newHelpRequest, setNewHelpRequest] = useState({
    type: '',
    amount: '',
    reason: '',
    description: '',
  });

  const handleEditField = async (fieldId: string) => {
    const f = fields.find((x) => x.id === fieldId);
    if (!f) return;
    setEditingField(f);
    setShowModal(true);
  };

  const handleDeleteField = async (fieldId: string) => {
    try {
      await deleteField(fieldId, {
        successMessage: 'Champ supprimé.',
        errorMessage: 'Suppression impossible.',
      });
      console.log('Champ correctement supprimé');
      setFields((prev) => prev.filter((f) => f.id !== fieldId));
    } catch (err) {
      console.error('Erreur lors de la suppression du champ :', err);
    }
  };

  const handleEdit = (activity) => {
    const flattenedActivity = {
      ...activity,
      field: activity.field?.id,
      plantation: activity.plantation?.id,
      stock: activity.stock?.id,
      operator: activity.operator?.id,
    };
    console.log('FLATTENED : ', flattenedActivity);

    setFlattenedActivity(flattenedActivity);
    setShowAddActivity(true);
  };

  const handleDelete = async (activityId: string) => {
    try {
      await deleteActivity(activityId);
      console.log('Activité correctement supprimée');
      setActivities((prev) => prev.filter((f) => f.id !== activityId));
    } catch (err) {
      console.error('Erreur lors de la suppression de l’activité :', err);
    }
  };

  const handleUpdate = (data) => {
    setFields((prev) =>
      prev.map((f) => (f.id === data.id ? { ...f, ...data } : f))
    );
  };

  const renderDashboard = () => (
    <div>
      <SimpleFarmGuide setActiveTab={setActiveTab}></SimpleFarmGuide>
    </div>
  );

  const openEditMember = (m) => {
    setSelectedMember(m);
    setShowMemberModal(true);
  };

  const handleDeleteMember = useCallback(
    async (id: string) => {
      if (!id) return;

      // snapshot avant modif (via set fonctionnel pour éviter un stale)
      setDeletingId(id);
      setMembers((prev) => {
        snapshotRef.current = prev;
        return prev.filter((m) => m.id !== id);
      });

      try {
        await deleteMember(id); // appelle l'API centralisée
        // succès → rien à faire, l’UI est déjà à jour
      } catch (e) {
        console.error('Suppression membre échouée:', e);
        // revert si erreur
        if (snapshotRef.current) setMembers(snapshotRef.current);
      } finally {
        setDeletingId(null);
        snapshotRef.current = null;
      }
    },
    [] // pas besoin de dépendre de `members` grâce au snapshotRef + set fonctionnel
  );

  const handleMemberSaved = useCallback((member) => {
    setMembers((prev) => {
      const ix = prev.findIndex((x) => x.id === member.id);
      if (ix === -1) return [member, ...prev];
      const next = prev.slice();
      next[ix] = { ...prev[ix], ...member };
      return next;
    });
  }, []);

  const renderFields = () => (
    <div className="space-y-6">
      <div className="bg-white max-w-7xl mx-auto px-6 py-4 rounded-xl border">
        <div className="py-5 mb-2">
          <div className="flex justify-between items-start px-6 gap-4 flex-wrap">
            <div className="flex-1 min-w-[350px]">
              <h2 className="text-2xl font-semibold text-black">
                Gestion des Champs
              </h2>
              <p className="text-gray-900 text-sm mt-1 max-w-3xl">
                Ajoutez vos parcelles pour un suivi personnalisé et des conseils
                adaptés à la croissance de vos cultures.
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="cursor-pointer shrink-0 bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2 h-11"
            >
              <Plus className="h-4 w-4" />
              Ajouter des champs
            </button>
          </div>
        </div>

        {showModal && (
          <NewFieldModal
            fieldId={selectedField}
            isOpen={showModal}
            mode={editingField ? 'edit' : 'create'}
            initialData={editingField ?? undefined}
            onClose={() => setShowModal(false)}
            onSubmit={(formData) => {
              if (editingField) {
                handleUpdate({ ...editingField, ...formData });
              } else {
                handleNewField(formData);
              }
              setShowModal(false);
            }}
          />
        )}

        {selectedField && (
          <FieldDetailsModal
            field={selectedField}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedField(null);
            }}
          />
        )}

        <ZonesManagementModal
          isOpen={showZonesModal}
          selectedField={selectedField}
          onClose={() => setShowZonesModal(false)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fields
            .slice()
            .sort((a, b) => {
              // 2) plus récent -> plus vieux
              return ts(pickDate(b)) - ts(pickDate(a));
            })
            .map((field) => (
              <div key={field.id}>
                {/* Header avec nom et actions */}
                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                  {/* En-tête compact avec gradient */}
                  <div
                    onClick={() => handleRedirectionField(field.id)}
                    className="bg-gradient-to-r from-emerald-600 to-green-600 p-4 text-white"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold truncate">
                          {field.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-green-100">
                            {field.currentCrop}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-lg font-bold">
                          {field.size} ha
                        </span>
                        <span className="text-xs text-green-100">
                          {field.zones?.length ?? 0} zones
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Corps compact */}
                  <div className="p-4">
                    {/* Infos principales en grille compacte */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="flex items-center gap-1">
                          <Layers className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-600">Sol</span>
                        </div>
                        <p className="text-xs font-semibold text-gray-800 truncate">
                          {field.soilType}
                        </p>
                        <p className="text-xs text-gray-500">
                          pH {field.soilPH}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="flex items-center gap-1">
                          <Droplets className="w-3 h-3 text-blue-500" />
                          <span className="text-xs text-gray-600">
                            Irrigation
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-gray-800 truncate">
                          {field.irrigationSystem}
                        </p>
                        <p className="text-xs text-gray-500">
                          {field.waterSource}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-purple-500" />
                          <span className="text-xs text-gray-600">
                            Position
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-gray-800">
                          {field.altitude}m • {field.exposition}
                        </p>
                        <p className="text-xs text-gray-500">
                          Pente {field.slope}%
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="flex items-center gap-1">
                          <Home className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-gray-600">Statut</span>
                        </div>
                        <p className="text-xs font-semibold text-gray-800">
                          {field.ownershipType}
                        </p>
                        <p className="text-xs text-gray-500">
                          {field.lease ? field.lease.cost : 'Propriétaire'}
                        </p>
                      </div>
                    </div>

                    {/* Dates importantes */}
                    <div className="flex justify-between mb-3 p-2 bg-blue-50 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-500">Plantation</p>
                        <p className="text-xs font-semibold text-gray-800">
                          {field.plantingDate
                            ? new Date(field.plantingDate).toLocaleDateString(
                                'fr-FR',
                                { day: '2-digit', month: 'short' }
                              )
                            : '-'}
                        </p>
                      </div>
                      <div className="text-gray-400">→</div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Récolte</p>
                        <p className="text-xs font-semibold text-gray-800">
                          {field.expectedHarvestDate
                            ? new Date(
                                field.expectedHarvestDate
                              ).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: 'short',
                              })
                            : '-'}
                        </p>
                      </div>
                    </div>

                    {/* Certifications et risques */}
                    <div className="space-y-2 mb-3">
                      {field.certifications &&
                        field.certifications.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Award className="w-3 h-3 text-indigo-500" />
                            <div className="flex flex-wrap gap-1">
                              {field.certifications
                                .slice(0, 2)
                                .map((cert, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded"
                                  >
                                    {cert}
                                  </span>
                                ))}
                              {field.certifications.length > 2 && (
                                <span className="text-xs text-gray-500">
                                  +{field.certifications.length - 2}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                      {/* Alertes compactes */}
                      <div className="flex gap-2">
                        {field.climateRisks &&
                          field.climateRisks.length > 0 && (
                            <div className="flex items-center gap-1 text-xs">
                              <CloudRain className="w-3 h-3 text-orange-500" />
                              <span className="text-gray-600">
                                {field.climateRisks.length} risques
                              </span>
                            </div>
                          )}
                        {field.pestRisks && field.pestRisks.length > 0 && (
                          <div className="flex items-center gap-1 text-xs">
                            <Bug className="w-3 h-3 text-red-500" />
                            <span className="text-gray-600">
                              {field.pestRisks.length} ravageurs
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions compactes */}
                    <div className="flex gap-2 relative">
                      <button
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                        onClick={() => {
                          setSelectedField(field); // vos données de champ
                          setIsModalOpen(true);
                        }}
                      >
                        <Eye className="w-3 h-3" />
                        Détails
                      </button>

                      <button
                        onClick={() => {
                          setShowZonesModal(true);
                          setSelectedField(field.id);
                        }}
                        className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
                      >
                        <Grid3X3 className="w-3 h-3" />
                        Zones
                      </button>

                      {/* Conteneur relatif pour le dropdown */}
                      <div className="flex relative gap-2">
                        <button
                          onClick={() => {
                            handleEditField(field?.id);
                            setSelectedField(field?.id);
                          }}
                          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                          onClick={() => handleDeleteField(field?.id)}
                        >
                          <Trash2 className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
        {fields.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Aucun champ trouvé
            </h3>
            <p className="text-gray-500">
              Essayez de modifier vos critères de recherche ou de filtrage
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderActivities = () => (
    <div className="space-y-6">
      <div className="bg-white max-w-7xl mx-auto px-6 py-4 rounded-xl border">
        {showAddActivity && (
          <AgriculturalActivityModal
            showAddActivity={showAddActivity}
            setShowAddActivity={setShowAddActivity}
            flattenedActivity={flattenedActivity}
            onSave={handleUpdateActivity}
          />
        )}

        <div className="py-5 mb-2">
          <div className="flex justify-between items-start px-6 gap-4 flex-wrap">
            <div className="flex-1 min-w-[350px]">
              <h2 className="text-2xl font-semibold text-black">
                Journal des Activitées
              </h2>
              <p className="text-gray-900 text-sm mt-1 max-w-3xl">
                Suivez vos activités, mettez à jour vos stocks automatiquement
                et organisez vos opérations en toute simplicité.
              </p>
            </div>

            <button
              onClick={() => setShowAddActivity(true)}
              className="cursor-pointer shrink-0 bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2 h-11"
            >
              <Plus className="h-4 w-4" />
              Ajouter une Activité
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6 space-y-4">
          {/* Barre de recherche */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher un produit, fournisseur ou lieu de stockage..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Catégories scrollables */}
          <div className="flex overflow-x-auto space-x-2 pb-1">
            {Object.entries(categories).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === key
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.icon}
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

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
                {activities.map((activity) => (
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
                          (activity.activityType === 'sowing' && '🌰 Semis') ||
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
                          {activity.plantation?.cropType === 'riz' && '🌾 Riz'}
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
                          activity.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : ''
                        }
                        ${
                          activity.status === 'planned'
                            ? 'bg-yellow-100 text-yellow-800'
                            : ''
                        }
                        ${
                          activity.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : ''
                        }
                        ${
                          activity.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : ''
                        }
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
                          onClick={() => openEdit(activity)}
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
            {activities.length === 0 && (
              <div className="text-center py-12">
                <ActivityIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Aucune activité trouvé
                </h3>
                <p className="text-gray-500">
                  Essayez de modifier vos critères de recherche ou de filtrage
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAsk = () => {
    const resourceData = Object.entries(annualPlan).map(([key, value]) => ({
      name:
        key === 'seeds'
          ? 'Graines'
          : key === 'water'
          ? 'Eau'
          : key === 'fuel'
          ? 'Carburant'
          : key === 'pesticides'
          ? 'Pesticides'
          : key === 'fertilizers'
          ? 'Engrais'
          : "Main d'œuvre",
      planned: value.planned,
      used: value.used,
      remaining: value.planned - value.used,
      efficiency: Math.round((value.used / value.planned) * 100),
      cost: value.cost,
      unit: value.unit,
    }));

    const budgetComparison = [
      { month: 'Jan', budget: 2000, actual: 1800, forecast: 1900 },
      { month: 'Fév', budget: 2200, actual: 2100, forecast: 2150 },
      { month: 'Mar', budget: 3500, actual: 3200, forecast: 3400 },
      { month: 'Avr', budget: 4000, actual: 4200, forecast: 4100 },
      { month: 'Mai', budget: 3800, actual: 3600, forecast: 3700 },
      { month: 'Jun', budget: 4200, actual: 4000, forecast: 4100 },
      { month: 'Jul', budget: 3600, actual: 3400, forecast: 3500 },
    ];

    const riskAlerts = [
      {
        type: 'warning',
        title: 'Budget eau insuffisant',
        message: 'Vous avez déjà utilisé 65% de votre budget eau annuel',
        severity: 'high',
        recommendation:
          "Considérez une demande d'aide pour système d'irrigation plus efficace",
      },
      {
        type: 'info',
        title: 'Économies sur les pesticides',
        message: 'Vous êtes 15% en dessous du budget pesticides prévu',
        severity: 'low',
        recommendation: "Excellent travail sur l'agriculture biologique",
      },
      {
        type: 'critical',
        title: 'Carburant critique',
        message: 'Budget carburant dépassé de 120€, impact sur rentabilité',
        severity: 'critical',
        recommendation: "Demande d'aide urgente recommandée",
      },
    ];

    const submitHelpRequest = () => {
      if (newHelpRequest.type && newHelpRequest.reason) {
        const request = {
          id: helpRequests.length + 1,
          ...newHelpRequest,
          status: 'pending',
          date: new Date().toISOString().split('T')[0],
        };
        setHelpRequests([request, ...helpRequests]);
        setNewHelpRequest({
          type: '',
          amount: '',
          reason: '',
          description: '',
        });
      }
    };

    const updateAnnualPlan = (resource, field, value) => {
      setAnnualPlan((prev) => ({
        ...prev,
        [resource]: {
          ...prev[resource],
          [field]: parseFloat(value) || 0,
        },
      }));
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Planification Annuelle & Demandes d'Aide
          </h2>
          <div className="flex gap-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Recalculer Budget
            </button>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Importer Plan
            </button>
          </div>
        </div>

        {/* Alertes de risque */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {riskAlerts.map((alert, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                alert.severity === 'critical'
                  ? 'bg-red-50 border-red-500'
                  : alert.severity === 'high'
                  ? 'bg-yellow-50 border-yellow-500'
                  : 'bg-blue-50 border-blue-500'
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle
                  className={`h-5 w-5 mt-0.5 ${
                    alert.severity === 'critical'
                      ? 'text-red-600'
                      : alert.severity === 'high'
                      ? 'text-yellow-600'
                      : 'text-blue-600'
                  }`}
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-2 italic">
                    {alert.recommendation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Planification des ressources */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Planification des Ressources Annuelles
            </h3>
            <div className="space-y-4">
              {Object.entries(annualPlan).map(([key, value]) => (
                <div
                  key={key}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-900 capitalize">
                      {key === 'seeds'
                        ? 'Graines'
                        : key === 'water'
                        ? 'Eau'
                        : key === 'fuel'
                        ? 'Carburant'
                        : key === 'pesticides'
                        ? 'Pesticides'
                        : key === 'fertilizers'
                        ? 'Engrais'
                        : "Main d'œuvre"}
                    </h4>
                    <span className="text-sm text-gray-500">{value.unit}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Prévu
                      </label>
                      <input
                        type="number"
                        value={value.planned}
                        onChange={(e) =>
                          updateAnnualPlan(key, 'planned', e.target.value)
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Utilisé
                      </label>
                      <input
                        type="number"
                        value={value.used}
                        onChange={(e) =>
                          updateAnnualPlan(key, 'used', e.target.value)
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Coût (€)
                      </label>
                      <input
                        type="number"
                        value={value.cost}
                        onChange={(e) =>
                          updateAnnualPlan(key, 'cost', e.target.value)
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between text-sm mb-2">
                    <span>
                      Progression:{' '}
                      {Math.round((value.used / value.planned) * 100)}%
                    </span>
                    <span
                      className={`font-medium ${
                        value.used > value.planned
                          ? 'text-red-600'
                          : value.used > value.planned * 0.8
                          ? 'text-yellow-600'
                          : 'text-green-600'
                      }`}
                    >
                      Restant: {value.planned - value.used} {value.unit}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        value.used > value.planned
                          ? 'bg-red-500'
                          : value.used > value.planned * 0.8
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{
                        width: `${Math.min(
                          (value.used / value.planned) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Demande d'aide à l'association */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Demander de l'Aide à l'Association
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type d'aide
                </label>
                <select
                  value={newHelpRequest.type}
                  onChange={(e) =>
                    setNewHelpRequest({
                      ...newHelpRequest,
                      type: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Sélectionner le type</option>
                  <option value="financial">Aide financière</option>
                  <option value="technical">Assistance technique</option>
                  <option value="equipment">Prêt d'équipement</option>
                  <option value="training">Formation</option>
                  <option value="emergency">Aide d'urgence</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Montant demandé (€)
                </label>
                <input
                  type="number"
                  value={newHelpRequest.amount}
                  onChange={(e) =>
                    setNewHelpRequest({
                      ...newHelpRequest,
                      amount: e.target.value,
                    })
                  }
                  placeholder="0"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motif principal
                </label>
                <input
                  type="text"
                  value={newHelpRequest.reason}
                  onChange={(e) =>
                    setNewHelpRequest({
                      ...newHelpRequest,
                      reason: e.target.value,
                    })
                  }
                  placeholder="Ex: Achat système irrigation"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description détaillée
                </label>
                <textarea
                  value={newHelpRequest.description}
                  onChange={(e) =>
                    setNewHelpRequest({
                      ...newHelpRequest,
                      description: e.target.value,
                    })
                  }
                  placeholder="Expliquez votre situation et pourquoi vous avez besoin d'aide..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
                />
              </div>

              <button
                onClick={submitHelpRequest}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Soumettre la demande
              </button>
            </div>

            {/* Historique des demandes */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">
                Historique des demandes
              </h4>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {helpRequests.map((request) => (
                  <div
                    key={request.id}
                    className="border border-gray-200 rounded-lg p-3"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-900">
                        {request.reason}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          request.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : request.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {request.status === 'approved'
                          ? 'Approuvé'
                          : request.status === 'pending'
                          ? 'En attente'
                          : 'Refusé'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>
                        {request.type === 'financial'
                          ? 'Aide financière'
                          : request.type === 'technical'
                          ? 'Assistance technique'
                          : 'Autre'}
                      </span>
                      <span>
                        {request.amount > 0 ? `${request.amount}€` : 'N/A'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(request.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Graphiques d'analyse */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Efficacité des ressources */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Efficacité des Ressources
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={resourceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="efficiency" fill="#8884d8" name="Efficacité %" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Comparaison budget vs réel */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Budget vs Réel vs Prévisions
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={budgetComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="budget"
                  stroke="#8884d8"
                  name="Budget"
                  strokeDasharray="5 5"
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#82ca9d"
                  name="Réel"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#ffc658"
                  name="Prévision"
                  strokeDasharray="3 3"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Résumé financier */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Résumé Financier Annuel
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800">
                Budget Total Prévu
              </h4>
              <p className="text-xl font-bold text-blue-600">
                €
                {Object.values(annualPlan)
                  .reduce((sum, item) => sum + item.cost, 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h4 className="text-sm font-medium text-green-800">
                Économies Réalisées
              </h4>
              <p className="text-xl font-bold text-green-600">€1,245</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <h4 className="text-sm font-medium text-yellow-800">
                Aide Demandée
              </h4>
              <p className="text-xl font-bold text-yellow-600">
                €
                {helpRequests
                  .reduce((sum, req) => sum + (req.amount || 0), 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h4 className="text-sm font-medium text-purple-800">
                ROI Prévisionnel
              </h4>
              <p className="text-xl font-bold text-purple-600">+18.5%</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStocks = () => {
    return <InventoryDisplayPage />;
  };

  const renderEquipements = () => {
    return <EquipmentDisplayPage />;
  };

  const renderMembers = () => {
    return (
      <>
        <div className="grid gap-6 rounded-xl">
          <div className="space-y-6">
            <div className="bg-white max-w-7xl mx-auto px-6 py-4 rounded-xl border">
              <div className="py-5 mb-2">
                <div className="flex justify-between items-start px-6 gap-4 flex-wrap">
                  <div className="flex-1 min-w-[350px]">
                    <h2 className="text-2xl font-semibold text-black">
                      Gestion des Membres
                    </h2>
                    <p className="text-gray-900 text-sm mt-1 max-w-3xl">
                      Ajoutez les membres impliqués dans la vie de la ferme afin
                      de suivre plus facilement les différentes tâches et
                      échéances.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAddMembers(true)}
                    className="cursor-pointer shrink-0 bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2 h-11"
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter des membres
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-4 mb-6 space-y-4">
                {/* Barre de recherche */}
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Rechercher un produit, fournisseur ou lieu de stockage..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Filtres */}
                <div className="grid grid-cols-1 sm:grid-cols-6 gap-2">
                  {/* Poste */}
                  <div>
                    <select
                      value={selectedJob}
                      onChange={(e) =>
                        setSelectedJob(e.target.value as Job | '')
                      }
                      className="w-full max-w-xs px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all appearance-none cursor-pointer text-sm"
                    >
                      <option value="" className="text-gray-500">
                        Tous les postes
                      </option>
                      {JOBS.map((job) => (
                        <option key={job} value={job} className="text-gray-700">
                          {job}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Département */}
                  <div>
                    <select
                      value={selectedDept}
                      onChange={(e) =>
                        setSelectedDept(e.target.value as Department | '')
                      }
                      className="w-full max-w-xs px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all appearance-none cursor-pointer text-sm"
                    >
                      <option value="" className="text-gray-500">
                        Tous les départements
                      </option>
                      {DEPARTMENTS.map((dept) => (
                        <option
                          key={dept}
                          value={dept}
                          className="text-gray-700"
                        >
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Type d'emploi */}
                  <div>
                    <select
                      value={selectedType}
                      onChange={(e) =>
                        setSelectedType(e.target.value as EmploymentType | '')
                      }
                      className="w-full max-w-xs px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all appearance-none cursor-pointer text-sm"
                    >
                      <option value="" className="text-gray-500">
                        Tous les types d'emploi
                      </option>
                      {EMPLOYMENT_TYPES.map((type) => (
                        <option
                          key={type}
                          value={type}
                          className="text-gray-700"
                        >
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <TeamMembersDisplay
                farmerId={farmerId}
                members={filtered}
                onEdit={openEditMember}
                onDelete={handleDeleteMember} // << passe le callback
                deletingId={deletingId}
              />
            </div>
          </div>
        </div>
        {showAddMembers && (
          <AddMemberModal
            source="ActionsDropdown"
            farmerId={farmerId}
            showAddMembers={showAddMembers}
            setShowAddMembers={setShowAddMembers}
            selectedMember={null}
            onSave={handleMemberSaved}
          />
        )}

        <AddMemberModal
          showAddMembers={showMemberModal}
          setShowAddMembers={setShowMemberModal}
          farmerId={farmerId}
          selectedMember={selectedMember} // <-- null = création ; non-null = édition
          onSave={handleMemberSaved}
          source="Dashboard"
        />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Wheat className="h-8 w-8 text-green-600" />
              <h1 className="text-xl font-bold text-gray-900">
                AgroManager Pro
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-gray-400 hover:text-gray-600">
                <Bell className="h-5 w-5" />
              </button>
              <button className="text-gray-400 hover:text-gray-600">
                <Settings className="h-5 w-5" />
              </button>
              <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                JD
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <nav className="mb-8">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Tableau de Bord', icon: BarChart3 },
              { id: 'fields', label: 'Champs', icon: MapPin },
              { id: 'stocks', label: 'Gestion du stock', icon: Warehouse },
              {
                id: 'equipements',
                label: 'Gestion des équipements',
                icon: Tractor,
              },
              { id: 'activities', label: 'Activités', icon: Activity },
              { id: 'members', label: 'Membres', icon: User2 },
              { id: 'ask', label: 'Demandes', icon: ShoppingCart },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </nav>
        {isSuccess && <Success text="L'agriculteur a été créé avec succès." />}
        {isError && (
          <Error text="Une erreur est survenue lors de la création de l'agriculteur." />
        )}

        {/* Contenu principal */}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'fields' && renderFields()}
        {activeTab === 'stocks' && renderStocks()}
        {activeTab === 'equipements' && renderEquipements()}
        {activeTab === 'activities' && renderActivities()}
        {activeTab === 'members' && renderMembers()}
        {activeTab === 'ask' && renderAsk()}
      </div>
    </div>
  );
};

export default AgriculturalDashboard;
