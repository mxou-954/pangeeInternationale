import React, { useState } from 'react';
import { 
  Leaf, 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  Scale, 
  Droplets, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle, 
  AlertTriangle,
  Edit3,
  Trash2,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Sprout
} from 'lucide-react';

export const ActionMenu = ({ onEdit, onDelete, harvestId}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
      >
        <MoreVertical className="w-4 h-4 text-white" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <button
            onClick={() => {
              onEdit(harvestId);
              setIsOpen(false);
            }}
            className="w-full flex items-center px-4 py-2 text-left hover:bg-gray-50 transition-colors text-gray-700"
          >
            <Edit3 className="w-4 h-4 mr-2 text-blue-600" />
            Modifier
          </button>
          <button
            onClick={() => {
              onDelete(harvestId);
              setIsOpen(false);
            }}
            className="w-full flex items-center px-4 py-2 text-left hover:bg-red-50 transition-colors text-red-600"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Supprimer
          </button>
        </div>
      )}
    </div>
  );
};