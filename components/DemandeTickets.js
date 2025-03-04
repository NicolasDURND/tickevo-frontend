import React, { useState } from "react";
import Incident from "./IncidentTickets";
import styles from "../styles/DemandeTickets.module.css";

const DemandeTickets = () => {
  const [activeTab, setActiveTab] = useState("demandes"); // État pour gérer l'onglet actif

  return (
    <div className={styles.card}>
      {/* Onglets */}
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

      {/* Contenu de l'onglet sélectionné */}
      {activeTab === "demandes" ? (
        <div className={styles.buttonContainer}>
          <button className={styles.button}>
            Demande Activation Habilitation
          </button>
          <button className={styles.button}>
            Demande Désactivation Habilitation
          </button>
          <button className={styles.button}>
            Actions à Réaliser sur un logiciel
          </button>
          <button className={styles.button}>Demande Matériel</button>
        </div>
      ) : (
        <Incident /> // Remplacement par le composant Incident
      )}
    </div>
  );
};

export default DemandeTickets;
