import React, { useState } from "react"; // Importe React et useState pour gérer l'état
import { useRouter } from "next/router"; // Importe le hook de navigation Next.js
import styles from "../styles/DemandeTickets.module.css"; // Importe les styles CSS

const Incident = () => {
  const router = useRouter(); // Permet la navigation entre les pages
  const [selectedIncident, setSelectedIncident] = useState(null); // Stocke le type d'incident sélectionné

  // Liste des sous-catégories en fonction du type d'incident
  const subCategories = {
    "Incident matériel": [
      "Problème d'écran",
      "Problème de clavier",
      "Panne électrique",
      "Autre",
    ],
    "Incident logiciel": ["Bug logiciel", "Problème d'accès", "Erreur système"],
    "Incident autre": ["Problème réseau", "Problème de connexion VPN", "Autre"],
  };

  // Affiche les sous-catégories associées à l'incident sélectionné
  const handleSelectIncident = (incidentType) => {
    setSelectedIncident(incidentType);
  };

  // Redirige vers la création d'un ticket avec la sous-catégorie choisie
  const handleCreateIncident = (category) => {
    router.push(`/tickets/new?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className={styles.buttonContainer}>
      {selectedIncident === null ? (
        // Première étape : choix du type d'incident
        <>
          <button
            className={styles.button}
            onClick={() => handleSelectIncident("Incident matériel")}
          >
            Incident matériel
          </button>
          <button
            className={styles.button}
            onClick={() => handleSelectIncident("Incident logiciel")}
          >
            Incident logiciel
          </button>
          <button
            className={styles.button}
            onClick={() => handleSelectIncident("Incident autre")}
          >
            Incident autre
          </button>
          <div>
            {/* Retour à l'accueil */}
            <button
              className={styles.buttonback}
              onClick={() => router.push("/home")}
            >
              Précédent
            </button>
          </div>
        </>
      ) : (
        // Deuxième étape : affichage des sous-catégories
        <>
          <h3 className={styles.object}>
            <strong>{selectedIncident}</strong>
          </h3>
          {subCategories[selectedIncident].map((subCategory, index) => (
            <button
              key={index}
              className={styles.button}
              onClick={() => handleCreateIncident(subCategory)}
            >
              {subCategory}
            </button>
          ))}
          <div>
            {/* Retour à l'écran précédent */}
            <button
              className={styles.buttonback}
              onClick={() => setSelectedIncident(null)}
            >
              Retour
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Incident; // Exporte le composant pour être utilisé ailleurs
