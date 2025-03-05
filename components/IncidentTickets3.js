import React from "react";
import styles from "../styles/DemandeTickets.module.css";

const IncidentTickets3 = () => {
  return (
    <div className={styles.buttonContainer}>
      <button className={styles.button}>Logiciel (CRM)</button>
      <button className={styles.button}>Logiciel 2 (ERP)</button>
      <button className={styles.button}>Logiciel 3 (Analytics)</button>

      <div>
        <button className={styles.buttonback}>Prédédent</button>
      </div>
    </div>
  );
};

export default IncidentTickets3;
