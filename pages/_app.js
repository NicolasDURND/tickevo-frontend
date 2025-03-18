import "../styles/globals.css"; // Import du fichier global de styles CSS
import Head from "next/head"; // Import du composant Head de Next.js pour gérer le titre et les métadonnées de la page
import { Provider } from "react-redux"; // Import du Provider de Redux pour donner accès au store Redux à toute l'application
import { PersistGate } from "redux-persist/integration/react"; // Import du PersistGate pour gérer la persistance des données Redux dans le stockage local
import { store, persistor } from "../store"; // Import du store Redux et du persistor pour conserver les données après un rechargement de page

// Composant principal qui enveloppe toute l'application Next.js
function App({ Component, pageProps }) {
  return (
    // Fournit le store Redux à toute l'application
    <Provider store={store}>
      {/* Permet de charger Redux depuis le stockage local avant d'afficher l'application */}
      <PersistGate loading={null} persistor={persistor}>
        <Head>
          <title>TickEvo - Gestion des tickets</title> {/* Définit le titre de la page */}
        </Head>
        {/* Rendu du composant de la page actuelle avec ses props */}
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}

export default App; // Exporte le composant pour être utilisé comme point d'entrée de l'application
