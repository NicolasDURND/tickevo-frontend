import React, { useState } from "react";
import { useRouter } from "next/router";
import Incident from "./IncidentTickets";
import styles from "../styles/DemandeTickets.module.css";

const DemandeTickets = () => {
  const [activeTab, setActiveTab] = useState("demandes");
  const router = useRouter();

  // Fonction pour rediriger vers la page de création de ticket avec l'objet sélectionné.
  const handleCreateTicket = (category) => {
    router.push(`/tickets/new?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Créer un ticket</h2>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === "demandes" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("demandes")}
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

      {activeTab === "demandes" ? (
        <div className={styles.buttonContainer}>
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
        <Incident /> // ✅ L'onglet incidents affiche `IncidentTickets.js`
      )}
    </div>
  );
};

export default DemandeTickets;
