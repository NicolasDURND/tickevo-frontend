import React, { useState, useEffect } from "react";
import styles from "../styles/LastTickets.module.css";

const LastTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/tickets/last"); // Appel vers ton backend
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des tickets");
        }
        const data = await response.json();
        setTickets(data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur :", error);
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Derniers Tickets en Cours</h2>
      {loading ? (
        <p>Chargement des tickets...</p>
      ) : tickets.length === 0 ? (
        <p>Aucun ticket en cours.</p>
      ) : (
        <ul className={styles.ticketList}>
          {tickets.map((ticket) => (
            <li key={ticket._id} className={styles.ticketItem}>
              <div className={styles.ticketHeader}>
                <span className={styles.ticketNumber}>
                  #{ticket.ticketNumber}
                </span>
                <span className={styles.status}>{ticket.status}</span>
              </div>
              <div className={styles.ticketTitle}>{ticket.title}</div>
              <div className={styles.ticketCategory}>
                Catégorie : {ticket.categories}
              </div>
              {ticket.assignedTo ? (
                <div className={styles.assignedTo}>
                  Assigné à : <strong>{ticket.assignedTo.username}</strong>
                </div>
              ) : (
                <div className={styles.notAssigned}>Non assigné</div>
              )}
            </li>
          ))}
        </ul>
      )}
      <div className={styles.buttonContainer}>
        <button className={styles.button}>Prédédent</button>
        <button className={styles.button}>Suivant</button>
      </div>
    </div>
  );
};

export default LastTickets;
