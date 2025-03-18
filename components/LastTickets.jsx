import React, { useEffect, useState } from "react"; // Gère l'affichage dynamique avec état et effets
import styles from "../styles/LastTickets.module.css"; // Importe les styles CSS
import { useRouter } from "next/router"; // Importe le hook de navigation Next.js

const LastTickets = () => {
  const [tickets, setTickets] = useState([]); // Stocke la liste des tickets
  const [currentPage, setCurrentPage] = useState(0); // Gère la pagination
  const ticketsPerPage = 5; // Nombre de tickets affichés par page
  const token = localStorage.getItem("token"); // Récupère le token pour l'authentification
  const router = useRouter(); // Permet la navigation entre les pages

  useEffect(() => {
    // Récupère les tickets depuis l'API
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
        setTickets(data); // Met à jour l'état avec les tickets récupérés
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des tickets :", error);
      }
    };

    fetchTickets();
  }, []);

  // Gère la pagination et filtre les tickets clôturés
  const totalPages = Math.ceil(tickets.length / ticketsPerPage);
  const startIndex = currentPage * ticketsPerPage;
  const displayedTickets = tickets
    .filter((ticket) => ticket.status.toLowerCase() !== "clôturé") // Exclut les tickets clôturés
    .slice(startIndex, startIndex + ticketsPerPage); // Sélectionne les tickets de la page en cours

  return (
    <div className={styles.card}> {/* Conteneur principal */}
      <h2 className={styles.title}>Mon historique de Tickets</h2> {/* Titre de la section */}

      {/* Tableau affichant les tickets */}
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
                  {/* Bouton pour voir les détails du ticket */}
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
              {/* Message affiché si aucun ticket n'est disponible */}
              <td colSpan="6" className={styles.noTickets}>
                Aucun ticket trouvé
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Boutons pour naviguer entre les pages de tickets */}
      <div className={styles.buttonContainer}>
        <button
          className={styles.button}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0} // Désactivé si on est à la première page
        >
          Précédent
        </button>
        <button
          className={styles.button}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
          }
          disabled={currentPage === totalPages - 1} // Désactivé si on est à la dernière page
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default LastTickets; // Exporte le composant pour être utilisé ailleurs