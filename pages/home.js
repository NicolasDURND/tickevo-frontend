import React from "react";
import HeaderUser from "../components/HeaderUser";
import DemandeTickets from "../components/DemandeTickets";
import LastTickets from "../components/LastTickets";
import headerStyles from "../styles/HeaderUser.module.css";
import ticketStyles from "../styles/DemandeTickets.module.css";
import lastTicketsStyles from "../styles/LastTickets.module.css";
import styles from "../styles/Home.module.css";

export default function Home() {
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
