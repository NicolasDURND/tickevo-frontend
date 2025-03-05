import React from "react";
import styles from "../styles/DemandeTickets.module.css";

const IncidentTickets2 = () => {
  return (
    <div className={styles.buttonContainer}>
      <button className={styles.button}>Ordinateur</button>
      <button className={styles.button}>Clavier / Souris</button>
      <button className={styles.button}>Imprimante</button>
      <button className={styles.button}>Téléphone</button>
      <div>
        <button className={styles.buttonback}>Prédédent</button>
      </div>
    </div>
  );
};

export default IncidentTickets2;
