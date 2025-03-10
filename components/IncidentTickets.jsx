import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/DemandeTickets.module.css";

const Incident = () => {
  const router = useRouter();
  const [selectedIncident, setSelectedIncident] = useState(null);

  // ✅ Liste des sous-catégories par type d'incident
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

  // ✅ Fonction pour afficher les sous-catégories
  const handleSelectIncident = (incidentType) => {
    setSelectedIncident(incidentType);
  };

  // ✅ Fonction pour créer un ticket depuis une sous-catégorie
  const handleCreateIncident = (category) => {
    router.push(`/tickets/new?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className={styles.buttonContainer}>
      {selectedIncident === null ? (
        // ✅ PREMIER NIVEAU : Choix du type d'incident
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
            <button
              className={styles.buttonback}
              onClick={() => router.push("/home")}
            >
              Précédent
            </button>
          </div>
        </>
      ) : (
        // ✅ DEUXIÈME NIVEAU : Affichage des sous-catégories
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

export default Incident;
