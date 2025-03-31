//  Importation du module `next/jest` qui adapte Jest à un projet Next.js
const nextJest = require('next/jest');

//  Création de la configuration Jest en spécifiant le répertoire racine du projet Next.js
const createJestConfig = nextJest({
  dir: './', // Indique que la configuration est basée dans le répertoire racine du projet
});

//  Configuration personnalisée pour Jest
const customJestConfig = {
  //  Définition des répertoires où Jest doit rechercher les modules
  moduleDirectories: ['node_modules', '<rootDir>/'],

  //  Définition de l'environnement de test
  // Utilise "jest-environment-jsdom" pour simuler un environnement navigateur
  testEnvironment: 'jest-environment-jsdom',
};

//  Exporte la configuration Jest générée
module.exports = createJestConfig(customJestConfig);
