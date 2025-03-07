import React from "react";
import HeaderAdministrateur from "../components/HeaderAdministrateur";
import DemandeTickets from "../components/DemandeTickets";
import LastTickets from "../components/LastTickets";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.main}>
      <HeaderAdministrateur />
      <div className={styles.container}>
        <DemandeTickets />
        <LastTickets />
      </div>
    </div>
  );
}
