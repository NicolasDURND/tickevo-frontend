import React, { useEffect, useState } from "react";
import styles from "../styles/MyTickets.module.css"; // ✅ On crée ce fichier après
import { useRouter } from "next/router";
import Footer from "./Footer";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]); // ✅ Tickets après filtrage
  const [activeFilter, setActiveFilter] = useState("Tous"); // ✅ Filtre actif
  const [openTicketId, setOpenTicketId] = useState(null); // ✅ Stocke l'ID du ticket ouvert
  const token = localStorage.getItem("token");
  const router = useRouter();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("http://localhost:3000/tickets/last", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Ajoute le token
          },
        });

        if (!response.ok) {
          throw new Error(
            `Erreur API: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        setTickets(data);
        setFilteredTickets(data); // ✅ Affiche tous les tickets au début
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des tickets :", error);
      }
    };

    fetchTickets();
  }, []);

  // ✅ Fonction pour filtrer les tickets selon leur statut
  const filterTickets = (status) => {
    setActiveFilter(status); // ✅ Change le filtre actif
    if (status === "Tous") {
      setFilteredTickets(tickets); // ✅ Affiche tous les tickets
    } else {
      setFilteredTickets(tickets.filter((ticket) => ticket.status === status));
    }
  };

  // ✅ Fonction pour basculer l'affichage des détails d'un ticket
  const toggleTicket = (ticketId) => {
    setOpenTicketId(openTicketId === ticketId ? null : ticketId); // Ferme si déjà ouvert, sinon ouvre
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Mon historique de Tickets</h2>

      {/* ✅ Boutons de filtrage */}
      <div className={styles.filterButtons}>
        <button
          className={`${styles.filterButton} ${
            activeFilter === "Tous" ? styles.active : ""
          }`}
          onClick={() => filterTickets("Tous")}
        >
          Tous
        </button>
        <button
          className={`${styles.filterButton} ${
            activeFilter === "en cours" ? styles.active : ""
          }`}
          onClick={() => filterTickets("en cours")}
        >
          En cours
        </button>
        <button
          className={`${styles.filterButton} ${
            activeFilter === "en attente" ? styles.active : ""
          }`}
          onClick={() => filterTickets("en attente")}
        >
          En attente
        </button>
        <button
          className={`${styles.filterButton} ${
            activeFilter === "clôturé" ? styles.active : ""
          }`}
          onClick={() => filterTickets("clôturé")}
        >
          Clôturé
        </button>
      </div>

      {filteredTickets.length > 0 ? (
        filteredTickets.map((ticket) => (
          <div key={ticket._id} className={styles.ticketContainer}>
            <div className={styles.ticketHeader}>
              <span>
                <strong>Ticket N°{ticket.ticketNumber}</strong> - {ticket.title}
              </span>
              <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
              <span>{ticket.category}</span>
              <span
                className={`${styles.status} ${
                  styles[ticket.status.toLowerCase()]
                }`}
              >
                {ticket.status}
              </span>

              {/* ✅ Flèche pour ouvrir/fermer le ticket */}
              <button
                onClick={() => toggleTicket(ticket._id)}
                className={styles.arrowButton}
              >
                {openTicketId === ticket._id ? "▲" : "▼"}
              </button>
            </div>

            {/* ✅ Détails affichés uniquement si le ticket est ouvert */}
            {openTicketId === ticket._id && (
              <div className={styles.ticketDetails}>
                <p>
                  <strong>Demande :</strong> {ticket.description}
                </p>
                {ticket.response && (
                  <p>
                    <strong>Réponse :</strong> {ticket.response}
                  </p>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <p className={styles.noTickets}>Aucun ticket trouvé</p>
      )}
      <Footer />
    </div>
  );
};

export default MyTickets;
