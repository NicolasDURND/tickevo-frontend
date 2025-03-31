// 📌 Importation des outils de Redux Toolkit et Redux Persist
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // 📌 Utilisation du stockage local (localStorage)

// 📌 Importation de ton reducer d'authentification
import auth from "./reducers/authentification";

//  CombineReducers : regroupe tous les reducers de l'application
const rootReducer = combineReducers({
  auth, // "auth" devient la clé du state où les données d'authentification seront stockées
});

//  Configuration de redux-persist pour stocker les données du Redux Store dans le localStorage
const persistConfig = {
  key: "tickevo", // 📌 Clé utilisée pour stocker les données dans le localStorage
  storage, // 📌 Définit le type de stockage (ici localStorage)
};

//  Création d'un reducer persistant qui applique redux-persist à rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

//  Configuration du store Redux avec Redux Toolkit
export const store = configureStore({
  reducer: persistedReducer, // 📌 Utilisation du reducer persistant
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }), // 📌 Désactive la vérification de la sérialisation pour éviter des erreurs avec redux-persist
});

//  Création d'un persistor qui va permettre de recharger les données sauvegardées au démarrage de l'application
export const persistor = persistStore(store); // 📌 Ce persistor est utilisé pour recharger les données stockées

export default store; // 📌 Exportation du store pour l'utiliser dans l'application

