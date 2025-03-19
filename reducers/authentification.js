import { createSlice } from "@reduxjs/toolkit"; //  Importation de `createSlice` depuis Redux Toolkit

// ✅ Définition de l'état initial pour la gestion de l'authentification
const initialState = {
  user: null, // Stocke les informations de l'utilisateur connecté (null signifie qu'aucun utilisateur n'est connecté)
  token: null, // Stocke le token d'authentification (JWT par exemple)
  loading: false, // Indique si une requête d'authentification est en cours
  error: null, // Stocke un éventuel message d'erreur en cas d'échec de connexion
};

// ✅ Création du slice Redux pour l'authentification
const authSlice = createSlice({
  name: "auth", // Nom du slice, utilisé dans Redux
  initialState, // Utilisation de l'état initial défini ci-dessus
  reducers: {
    // ✅ Action pour démarrer le processus de connexion
    loginStart: (state) => {
      state.loading = true; // Active l'état "loading" pour indiquer qu'une requête est en cours
      state.error = null; // Réinitialise toute erreur précédente
    },
    
    // ✅ Action pour une connexion réussie
    loginSuccess: (state, action) => {
      state.user = action.payload.user; // Stocke les infos de l'utilisateur reçu depuis l'API
      state.token = action.payload.token; // Stocke le token JWT
      state.loading = false; // Désactive l'état "loading"
      state.error = null; // Réinitialise toute erreur éventuelle
    },

    // ✅ Action pour une connexion échouée
    loginFailure: (state, action) => {
      state.error = action.payload; // Stocke le message d'erreur reçu (ex: "Email ou mot de passe incorrect")
      state.loading = false; // Désactive l'état "loading"
    },

    // ✅ Action pour déconnecter l'utilisateur
    logout: (state) => {
      state.user = null; // Supprime les infos de l'utilisateur
      state.token = null; // Supprime le token JWT
      state.error = null; // Réinitialise les erreurs
    },

    // ✅ Action pour mettre à jour les infos de l'utilisateur (utile si on veut rafraîchir les infos après modification)
    setUser: (state, action) => {
      state.user = action.payload.user; // Met à jour l'utilisateur
      state.token = action.payload.token; // Met à jour le token
    },
  },
});

// ✅ Exportation des actions pour pouvoir les utiliser dans les composants
export const { loginStart, loginSuccess, loginFailure, logout, setUser } = authSlice.actions;

// ✅ Exportation du reducer pour l'utiliser dans `store.js`
export default authSlice.reducer; // 🔥 Ce reducer doit être ajouté dans la configuration du store Redux
