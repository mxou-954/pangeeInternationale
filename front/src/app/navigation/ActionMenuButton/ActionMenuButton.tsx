import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, CircleArrowOutDownRight, UserPlus, Settings, FileText, Download } from 'lucide-react';

export default function DropdownActionButton () {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fermer le dropdown quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fonctions pour les actions
  const handleRedirectionCountry = () => {
    console.log("Redirection vers l'ajout de pays");
    setIsOpen(false);
    // Votre logique ici
  };

  const setShowAddForm = (value) => {
    console.log("Affichage du formulaire d'ajout:", value);
    setIsOpen(false);
    // Votre logique ici
  };

  const handleExport = () => {
    console.log("Export des données");
    setIsOpen(false);
    // Votre logique ici
  };

  const handleSettings = () => {
    console.log("Ouverture des paramètres");
    setIsOpen(false);
    // Votre logique ici
  };

  return (
    <div className="relative inline-block z-40" ref={dropdownRef}>
      {/* Bouton principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-700 hover:shadow-lg transition-all transform hover:scale-105"
      >
        <Settings className="w-5 h-5" />
        Actions
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Menu déroulant */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-40 animate-in fade-in slide-in-from-top-1">
          <div className="py-2">
            {/* Bouton Ajouter des pays */}
            <button
              onClick={handleRedirectionCountry}
              className="w-full text-left px-4 py-3 text-blue-600 font-medium flex items-center gap-3 hover:bg-blue-50 transition-colors"
            >
              <CircleArrowOutDownRight className="w-5 h-5" />
              Ajouter des pays
            </button>

            {/* Bouton Nouvel agriculteur */}
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full text-left px-4 py-3 text-blue-600 font-medium flex items-center gap-3 hover:bg-blue-50 transition-colors"
            >
              <UserPlus className="w-5 h-5" />
              Nouvel agriculteur
            </button>

            {/* Séparateur */}
            <div className="my-2 border-t border-gray-100"></div>

            {/* Autres boutons d'exemple */}
            <button
              onClick={handleExport}
              className="w-full text-left px-4 py-3 text-gray-700 font-medium flex items-center gap-3 hover:bg-gray-50 transition-colors"
            >
              <Download className="w-5 h-5" />
              Exporter les données
            </button>

            <button
              onClick={handleSettings}
              className="w-full text-left px-4 py-3 text-gray-700 font-medium flex items-center gap-3 hover:bg-gray-50 transition-colors"
            >
              <FileText className="w-5 h-5" />
              Générer un rapport
            </button>
          </div>
        </div>
      )}
    </div>
  );
};