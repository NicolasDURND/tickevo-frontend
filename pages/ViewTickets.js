import { useEffect, useState } from "react";
import HeaderTechnicien from "../components/HeaderTechnicien";
import HeaderAdministrateur from "../components/HeaderAdministrateur";
import styles from "../styles/ViewTickets.module.css";
import { useRouter } from "next/router";

const ViewTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [sortedTickets, setSortedTickets] = useState([]);
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
      const user = JSON.parse(storedUser);
      setUserId(user.id);
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

  // ✅ Trier les tickets à chaque fois que la liste de tickets change
  useEffect(() => {
    // Fonction pour trier les tickets
    const sortTickets = () => {
      if (!tickets || tickets.length === 0) return [];
      
      // Séparation des tickets clôturés et non clôturés
      const closedTickets = tickets.filter(ticket => ticket.status === "clôturé");
      const activeTickets = tickets.filter(ticket => ticket.status !== "clôturé");
      
      // Tri des tickets actifs du plus récent au plus ancien
      const sortedActiveTickets = activeTickets.sort((a, b) => {
        // Utilisation de la date de création pour trier
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA; // Ordre décroissant (plus récent en premier)
      });
      
      // Tri des tickets clôturés du plus récent au plus ancien
      const sortedClosedTickets = closedTickets.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA;
      });
      
      // Retourne les tickets actifs suivis des tickets clôturés
      return [...sortedActiveTickets, ...sortedClosedTickets];
    };
    
    // Mise à jour des tickets triés
    setSortedTickets(sortTickets());
  }, [tickets]);

  // ✅ Fonction pour assigner un ticket à l'utilisateur connecté
  const handleAssignTicket = async (ticketId) => {
    try {
      // ✅ Vérifier si l'utilisateur est un technicien ou un administrateur
      if (userRole !== "Technicien" && userRole !== "Administrateur") {
        setError("Vous n'avez pas les droits pour assigner des tickets");
        return;
      }

      const response = await fetch(`http://localhost:3000/ticketsTechnicien/${ticketId}/assign`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ technicianId: userId }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'assignation du ticket");
      }

      // ✅ Rediriger vers la page des tickets attribués avec l'ID du ticket
      router.push(`/ticketsAttribuer?ticketId=${ticketId}`);
    } catch (err) {
      setError(err.message);
    }
  };

  // ✅ Fonction pour vérifier si un ticket peut être assigné
  const canAssignTicket = (ticket) => {
    // Vérifier si l'utilisateur est technicien ou administrateur et si le statut du ticket est "en attente" ou "en cours"
    return (userRole === "Administrateur" || userRole === "Technicien") 
      && (ticket.status === "en attente" || ticket.status === "en cours" || !ticket.status);
  };

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
                  <th>Assigné à</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedTickets.map((ticket) => (
                  <tr key={ticket._id} className={ticket.status === "clôturé" ? styles.closedTicket : ""}>
                    <td>{ticket.ticketNumber}</td>
                    <td>{ticket.title}</td>
                    <td>{ticket.description}</td>
                    <td>
                      {ticket.status === "clôturé" ? (
                        <span className={styles.closedLabel}>Clôturé</span>
                      ) : ticket.status === "en cours" ? (
                        <span className={styles.inProgressLabel}>En cours</span>
                      ) : (
                        <span className={styles.pendingLabel}>En attente</span>
                      )}
                    </td>
                    <td>{ticket.userId?.username || "Inconnu"}</td>
                    <td>{ticket.assignedTo?.username || ""}</td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button 
                          className={styles.viewButton}
                          onClick={() => router.push(`/tickets/${ticket._id}`)}
                        >
                          Voir
                        </button>
                        {canAssignTicket(ticket) && (
                          <button 
                            className={styles.assignButton}
                            onClick={() => handleAssignTicket(ticket._id)}
                          >
                            S'assigner
                          </button>
                        )}
                      </div>
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
