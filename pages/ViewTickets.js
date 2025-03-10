import { useEffect, useState } from "react";
import styles from "../styles/ViewTickets.module.css"; // ✅ Import du style

const ViewTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("http://localhost:3000/tickets", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ Authentification
          },
        });

        if (!response.ok) {
          throw new Error("Accès refusé ou erreur serveur");
        }

        const data = await response.json();
        setTickets(data.tickets);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) return <p className={styles.loading}>Chargement des tickets...</p>;
  if (error) return <p className={styles.error}>Erreur : {error}</p>;
  if (tickets.length === 0) return <p className={styles.noTickets}>Aucun ticket trouvé.</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Liste des Tickets</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Numéro</th>
            <th className={styles.th}>Titre</th>
            <th className={styles.th}>Description</th>
            <th className={styles.th}>Statut</th>
            <th className={styles.th}>Créé par</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket._id} className={styles.tr}>
              <td className={styles.td}>{ticket.ticketNumber}</td>
              <td className={styles.td}>{ticket.title}</td>
              <td className={styles.td}>{ticket.description}</td>
              <td className={styles.td}>{ticket.status}</td>
              <td className={styles.td}>{ticket.userId?.username || "Inconnu"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewTickets;
