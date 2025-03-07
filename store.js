import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Import de tes reducers
import auth from "./reducers/authentification";

// CombineReducers
const rootReducer = combineReducers({
  auth, // clé
});

// Configuration redux-persist
const persistConfig = {
  key: "tickevo",
  storage,
};

// Reducer persistant
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Création du store avec middleware adapté pour la persistance
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

// Création du persistor
export const persistor = persistStore(store);

export default store;
