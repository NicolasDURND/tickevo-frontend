import React from "react"; // Import de React
import Login from "../components/Login"; // Import du composant Login
import styles from "../styles/Login.module.css"; // Import du fichier CSS spécifique à la page de connexion

// ✅ Composant représentant la page d'accueil (page de connexion)
export default function Index() {
  return (
    <div className={styles.main}> {/* Applique le style principal */}
      <Login /> {/* Affiche le composant Login pour la connexion */}
      <div className={styles.container}> {/* Conteneur supplémentaire, peut être utilisé pour ajouter du contenu plus tard */}
      </div>
    </div>
  );
}
