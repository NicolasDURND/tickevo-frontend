/** 
 * ✅ Configuration Next.js 
 * @type {import('next').NextConfig} 
 */
const nextConfig = {
  // ✅ Active le mode strict de React
  // Cela permet de détecter les problèmes potentiels dans le code
  reactStrictMode: true,

  // ✅ Configuration des images optimisées par Next.js
  images: {
    // ✅ Définition des domaines autorisés pour le chargement d'images externes
    domains: [], // Domaines autorisés pour les images externes (ex: ["example.com"])
  },
};

// ✅ Exporte la configuration pour que Next.js puisse l'utiliser
module.exports = nextConfig;
