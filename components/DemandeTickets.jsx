import React, { useState } from "react"; // Importe React et useState pour gérer l'état local
import { useRouter } from "next/router"; // Importe le router de Next.js pour la navigation
import Incident from "./IncidentTickets"; // Importe le composant IncidentTickets
import styles from "../styles/DemandeTickets.module.css"; // Importe les styles CSS

const DemandeTickets = () => {
  const [activeTab, setActiveTab] = useState("demandes"); // État pour gérer l'onglet actif (par défaut "demandes")
  const router = useRouter(); // Initialise le router pour naviguer entre les pages

  // Redirige vers la page de création d'un ticket avec la catégorie sélectionnée
  const handleCreateTicket = (category) => {
    router.push(`/tickets/new?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className={styles.card}> {/* Conteneur principal du composant */}
      <h2 className={styles.title}>Créer un ticket</h2> {/* Titre de la section */}

      {/* Onglets pour basculer entre "Demandes" et "Incidents" */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === "demandes" ? styles.activeTab : "" // Ajoute une classe active si l'onglet est sélectionné
          }`}
          onClick={() => setActiveTab("demandes")} // Change l'onglet actif
        >
          Demandes
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "incidents" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("incidents")}
        >
          Incidents
        </button>
      </div>

      {/* Affichage des boutons selon l'onglet actif */}
      {activeTab === "demandes" ? (
        <div className={styles.buttonContainer}>
          {/* Liste des différentes demandes possibles */}
          <button
            className={styles.button}
            onClick={() =>
              handleCreateTicket("Demande Activation Habilitation")
            }
          >
            Demande Activation Habilitation
          </button>
          <button
            className={styles.button}
            onClick={() =>
              handleCreateTicket("Demande Désactivation Habilitation")
            }
          >
            Demande Désactivation Habilitation
          </button>
          <button
            className={styles.button}
            onClick={() =>
              handleCreateTicket("Actions à Réaliser sur un logiciel")
            }
          >
            Actions à Réaliser sur un logiciel
          </button>
          <button
            className={styles.button}
            onClick={() => handleCreateTicket("Demande Matériel")}
          >
            Demande Matériel
          </button>

          {/* Bouton pour revenir à la page précédente */}
          <div>
            <button
              className={styles.buttonback}
              onClick={() => router.push("/home")}
            >
              Précédent
            </button>
          </div>
        </div>
      ) : (
        <Incident /> // Affiche le composant IncidentTickets si l'onglet "Incidents" est actif
      )}
    </div>
  );
};

export default DemandeTickets; // Exporte le composant pour l'utiliser ailleurs
