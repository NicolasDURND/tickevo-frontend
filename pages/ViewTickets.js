import { useEffect, useState } from "react";
import HeaderTechnicien from "../components/HeaderTechnicien";
import HeaderAdministrateur from "../components/HeaderAdministrateur";
import styles from "../styles/ViewTickets.module.css";

const ViewTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // ✅ Récupère le rôle de l'utilisateur stocké dans localStorage
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setUserRole(storedRole);
    }

    // ✅ Requête fetch vers le backend sur localhost:3000
    const fetchTickets = async () => {
      try {
        const response = await fetch("http://localhost:3000/tickets", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ Vérifie l'authentification
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
      {/* ✅ Affichage dynamique du bon Header */}
      {userRole === "Administrateur" ? (
        <HeaderAdministrateur />
      ) : userRole === "Technicien" ? (
        <HeaderTechnicien />
      ) : (
        <p className={styles.error}>Accès refusé</p>
      )}

      {/* ✅ Contenu principal */}
      {userRole === "Administrateur" || userRole === "Technicien" ? (
        <div className={styles.content}>
          <h2 className={styles.title}>Liste des Tickets</h2>

          <div className={styles.ticketsContainer}>
            <table className={styles.ticketsTable}>
              <thead>
                <tr>
                  <th>Numéro</th>
                  <th>Titre</th>
                  <th>Description</th>
                  <th>Statut</th>
                  <th>Créé par</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket._id}>
                    <td>{ticket.ticketNumber}</td>
                    <td>{ticket.title}</td>
                    <td>{ticket.description}</td>
                    <td>
                      {ticket.status === "clôturé" ? (
                        <span className={styles.closedLabel}>Clôturé</span>
                      ) : (
                        ticket.status
                      )}
                    </td>
                    <td>{ticket.userId?.username || "Inconnu"}</td>
                    <td>
                      <button className={styles.viewButton}>Voir</button>
                      {userRole === "Administrateur" && (
                        <button className={styles.assignButton}>Assigner</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ViewTickets;


