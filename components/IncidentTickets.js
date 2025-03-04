import React from "react";
import styles from "../styles/DemandeTickets.module.css";

const Incident = () => {
  return (
    <div className={styles.buttonContainer}>
      <button className={styles.button}>Incident matériel</button>
      <button className={styles.button}>Incident logiciel</button>
      <button className={styles.button}>Incident autre</button>
    </div>
  );
};

export default Incident;
