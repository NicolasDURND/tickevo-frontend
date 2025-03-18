import React, { useEffect, useState } from "react"; // Importe React et les hooks useState et useEffect
import styles from "../styles/MyTickets.module.css"; // Importe les styles CSS
import { useRouter } from "next/router"; // Importe le hook de navigation Next.js
import Footer from "./Footer"; // Importe le footer du site

const MyTickets = () => {
  const [tickets, setTickets] = useState([]); // Stocke tous les tickets récupérés
  const [filteredTickets, setFilteredTickets] = useState([]); // Tickets après application du filtre
  const [activeFilter, setActiveFilter] = useState("Tous"); // Stocke le filtre actif
  const [openTicketId, setOpenTicketId] = useState(null); // Stocke l'ID du ticket actuellement ouvert
  const token = localStorage.getItem("token"); // Récupère le token utilisateur
  const router = useRouter(); // Permet de naviguer entre les pages

  useEffect(() => {
    // Récupère les tickets depuis l'API
    const fetchTickets = async () => {
      try {
        const response = await fetch("http://localhost:3000/tickets/last", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Envoie le token pour l'authentification
          },
        });

        if (!response.ok) {
          throw new Error(
            `Erreur API: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        setTickets(data); // Stocke tous les tickets
        setFilteredTickets(data); // Affiche tous les tickets par défaut
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des tickets :", error);
      }
    };

    fetchTickets();
  }, []);

  // Filtre les tickets selon leur statut
  const filterTickets = (status) => {
    setActiveFilter(status); // Change le filtre actif
    if (status === "Tous") {
      setFilteredTickets(tickets); // Affiche tous les tickets
    } else {
      setFilteredTickets(tickets.filter((ticket) => ticket.status === status));
    }
  };

  // Ouvre ou ferme les détails d'un ticket
  const toggleTicket = (ticketId) => {
    setOpenTicketId(openTicketId === ticketId ? null : ticketId); // Ferme si déjà ouvert, sinon ouvre
  };

  return (
    <div className={styles.container}> {/* Conteneur principal */}
      <h2 className={styles.title}>Mon historique de Tickets</h2> {/* Titre de la section */}

      {/* Boutons pour filtrer les tickets */}
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

      {/* Affichage des tickets filtrés */}
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
                className={`${styles.status} ${styles[ticket.status
                  .toLowerCase()
                  .replace(/\s+/g, "-")]}`}
              >
                {ticket.status}
              </span>

              {/* Flèche pour ouvrir/fermer le ticket */}
              <button
                onClick={() => toggleTicket(ticket._id)}
                className={styles.arrowButton}
              >
                {openTicketId === ticket._id ? "▲" : "▼"}
              </button>
            </div>

            {/* Détails affichés uniquement si le ticket est ouvert */}
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
                
                {/* Affichage du dernier commentaire laissé par un technicien */}
                <div className={styles.sectionBox}>
                  <h2 className={styles.sectionTitle}>Réponse du technicien :</h2>
                  <div className={styles.historyContainer}>
                    {ticket.comments && ticket.comments.length > 0 ? (
                      // Récupère uniquement le dernier commentaire
                      (() => {
                        const lastComment = ticket.comments[ticket.comments.length - 1];
                        return (
                          <div key={lastComment._id} className={styles.historyItem}>
                            <div className={styles.commentHeader}>
                              <span className={styles.commentDate}>
                                le&nbsp;
                                {new Date(lastComment.timestamp).toLocaleDateString()} {" "}
                                {" à "}
                                {new Date(lastComment.timestamp).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>{" "}
                              <span className={styles.commentAuthor}>
                                De :&nbsp;
                                {lastComment.userId?.username || "Utilisateur inconnu"}
                              </span>
                            </div>
                            <div className={styles.commentContent}>{lastComment.message}</div>
                          </div>
                        );
                      })()
                    ) : (
                      <p className={styles.noComments}>Aucun message de clôture disponible.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className={styles.noTickets}>Aucun ticket trouvé</p> // Message si aucun ticket disponible
      )}
    </div>
  );
};

export default MyTickets; // Exporte le composant pour être utilisé ailleurs
