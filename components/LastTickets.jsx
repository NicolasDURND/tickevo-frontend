import React, { useEffect, useState } from "react";
import styles from "../styles/LastTickets.module.css";
import { useRouter } from "next/router";

const LastTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // ✅ Gère la pagination
  const ticketsPerPage = 5; // ✅ Nombre de tickets affichés par page
  const token = localStorage.getItem("token");
  const router = useRouter();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("http://localhost:3000/tickets/last", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(
            `Erreur API: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des tickets :", error);
      }
    };

    fetchTickets();
  }, []);

  // ✅ Gestion de la pagination
  const totalPages = Math.ceil(tickets.length / ticketsPerPage);
  const startIndex = currentPage * ticketsPerPage;
  const displayedTickets = tickets
  .filter((ticket) => ticket.status.toLowerCase() !== "clôturé") // ✅ Filtre les tickets clôturés
  .slice(startIndex, startIndex + ticketsPerPage);


  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Mon historique de Tickets</h2>

      {/* ✅ Tableau des tickets */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>N°</th>
            <th>Émetteur</th>
            <th>Date</th>
            <th>Type</th>
            <th>Statut</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {displayedTickets.length > 0 ? (
            displayedTickets.map((ticket) => (
              <tr key={ticket._id}>
                <td className={styles.ticketNumber}>{ticket.ticketNumber}</td>
                <td>{ticket.createdBy.username}</td>
                <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                <td>{ticket.category}</td>
                <td className={styles[ticket.status.toLowerCase()]}>
                  {ticket.status}
                </td>
                <td>
                  <button
                    className={styles.detailButton}
                    onClick={() => router.push(`/tickets/${ticket._id}`)}
                  >
                    Détails
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className={styles.noTickets}>
                Aucun ticket trouvé
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ✅ Boutons de navigation */}
      <div className={styles.buttonContainer}>
        <button
          className={styles.button}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
        >
          Précédent
        </button>
        <button
          className={styles.button}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
          }
          disabled={currentPage === totalPages - 1}
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default LastTickets;
