import React from "react";
import DemandeTickets from "../components/DemandeTickets";
import LastTickets from "../components/LastTickets";
import HeaderUser from "../components/HeaderUser";
import styles from "../styles/Home.module.css"; // Import des styles

export default function Index() {
  return (
    <div className={styles.main}>
      <HeaderUser />
      <div className={styles.container}>
        <DemandeTickets />
        <LastTickets />
      </div>
    </div>
  );
}
