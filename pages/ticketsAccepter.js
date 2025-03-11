import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import HeaderTechnicien from "../components/HeaderTechnicien";
import HeaderAdministrateur from "../components/HeaderAdministrateur";
import styles from "../styles/TicketsAccepter.module.css";

const TicketsAccepter = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // ✅ Récupère le rôle de l'utilisateur stocké dans localStorage
    const storedRole = localStorage.getItem("role");
    const storedUser = localStorage.getItem("user");
    
    if (storedRole) {
      setUserRole(storedRole);
    }
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserId(user.id);
        
        // ✅ Chargement des tickets une fois l'utilisateur identifié
        if (user.id) {
          fetchUserTickets(user.id);
        }
      } catch (err) {
        console.error("Erreur lors du parsing des informations utilisateur:", err);
        setError("Erreur lors de la récupération des informations utilisateur");
        setLoading(false);
      }
    }
  }, []);

  // ✅ Fonction pour récupérer les tickets de l'utilisateur (assignés ou clôturés)
  const fetchUserTickets = async (userId) => {
    try {
      setLoading(true);
      console.log("[TicketsAccepter] Récupération des tickets pour l'utilisateur:", userId);
      
      // Ajout d'une période d'attente pour s'assurer que le serveur est prêt
      const response = await fetch(`http://localhost:3000/ticketsTechnicien/assigned/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        console.error(`[TicketsAccepter] Erreur HTTP: ${response.status}`);
        throw new Error(`Erreur lors de la récupération des tickets: ${response.status}`);
      }

      const data = await response.json();
      console.log("[TicketsAccepter] Tickets récupérés:", data);
      
      // Vérifier si les tickets existent dans la réponse
      if (!data.tickets) {
        console.error("[TicketsAccepter] Format de réponse inattendu:", data);
        setTickets([]);
        return;
      }
      
      // ✅ Récupération des tickets (déjà triés par le backend du plus récent au plus ancien)
      setTickets(data.tickets);
    } catch (err) {
      console.error("[TicketsAccepter] Erreur:", err);
      setError(`Erreur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        {/* ✅ Affichage dynamique du bon Header */}
        {userRole === "Administrateur" ? (
          <HeaderAdministrateur />
        ) : userRole === "Technicien" ? (
          <HeaderTechnicien />
        ) : null}
        <div className={styles.loading}>Chargement des tickets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        {/* ✅ Affichage dynamique du bon Header */}
        {userRole === "Administrateur" ? (
          <HeaderAdministrateur />
        ) : userRole === "Technicien" ? (
          <HeaderTechnicien />
        ) : null}
        <div className={styles.error}>Erreur : {error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* ✅ Affichage dynamique du bon Header */}
      {userRole === "Administrateur" ? (
        <HeaderAdministrateur />
      ) : userRole === "Technicien" ? (
        <HeaderTechnicien />
      ) : null}

      <div className={styles.content}>
        <h2 className={styles.title}>Mes tickets</h2>

        <div className={styles.ticketsContainer}>
          {tickets.length === 0 ? (
            <p className={styles.noTickets}>Aucun ticket assigné.</p>
          ) : (
            <table className={styles.ticketsTable}>
              <thead>
                <tr>
                  <th>Numéro</th>
                  <th>Date</th>
                  <th>Titre</th>
                  <th>Créé par</th>
                  <th>Catégorie</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket._id}>
                    <td>{ticket.ticketNumber}</td>
                    <td>{new Date(ticket.createdAt).toLocaleDateString("fr-FR")}</td>
                    <td>{ticket.title}</td>
                    <td>{ticket.userId?.username || "Inconnu"}</td>
                    <td>{ticket.category || "Demande"}</td>
                    <td>
                      {ticket.status === "clôturé" ? (
                        <span className={styles.closedLabel}>clôturé</span>
                      ) : ticket.status === "en cours" ? (
                        <span className={styles.inProgressLabel}>en cours</span>
                      ) : (
                        <span className={styles.pendingLabel}>en attente</span>
                      )}
                    </td>
                    <td>
                      <button
                        className={styles.viewButton}
                        onClick={() => router.push(`/ticketsAttribuer?ticketId=${ticket._id}`)}
                      >
                        Voir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketsAccepter;