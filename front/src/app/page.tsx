"use client"

import React from 'react';
import { Users, Settings, Leaf } from 'lucide-react';

export default function PangeeHomepage() {

  const handleAdminRedirect = () => {
    window.location.href = '/navigation/loginAdmin';
  };

  const handleFarmerRedirect = () => {
    window.location.href = '/navigation/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <Leaf className="h-8 w-8 text-green-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Pangee Internationale</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Bienvenue sur Pangee Internationale
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Association dédiée au développement agricole durable et à la promotion 
            des pratiques innovantes pour un avenir alimentaire responsable.
          </p>
        </div>

        {/* Access Portals */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Admin Portal */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Settings className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Espace Administrateur
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Accédez aux outils de gestion, tableaux de bord et fonctionnalités 
              d'administration de l'association.
            </p>
            <button
              onClick={handleAdminRedirect}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Accéder à l'administration
            </button>
          </div>

          {/* Farmers Portal */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Espace Fermiers
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Découvrez les ressources, formations et outils dédiés aux 
              agriculteurs et producteurs membres.
            </p>
            <button
              onClick={handleFarmerRedirect}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Accéder à l'espace fermiers
            </button>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Notre Mission
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Pangee Internationale œuvre pour la transformation durable de l'agriculture 
              mondiale en connectant les acteurs du terrain avec les innovations technologiques 
              et les meilleures pratiques environnementales. Nous soutenons les agriculteurs 
              dans leur transition vers des méthodes plus respectueuses de l'environnement 
              tout en garantissant la sécurité alimentaire.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Leaf className="h-6 w-6 text-green-400 mr-2" />
              <span className="text-lg font-semibold">Pangee Internationale</span>
            </div>
            <p className="text-gray-400">
              © 2025 Pangee Internationale. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}