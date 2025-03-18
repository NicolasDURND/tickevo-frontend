import { useEffect, useState } from "react"; // Import des hooks useEffect et useState pour gérer les effets et l'état
import HeaderTechnicien from "../components/HeaderTechnicien"; // Import du header pour les techniciens
import HeaderAdministrateur from "../components/HeaderAdministrateur"; // Import du header pour les administrateurs
import styles from "../styles/AllTicketsList.module.css"; // Import du fichier CSS spécifique à la page
import { useRouter } from "next/router"; // Import du hook useRouter pour gérer la navigation

const allTicketsList = () => {
  const [tickets, setTickets] = useState([]); // Stocke la liste des tickets récupérés du backend
  const [sortedTickets, setSortedTickets] = useState([]); // Stocke la liste triée des tickets
  const [loading, setLoading] = useState(true); // Gère l'affichage du chargement
  const [error, setError] = useState(""); // Stocke les erreurs éventuelles
  const [userRole, setUserRole] = useState(null); // Stocke le rôle de l'utilisateur connecté
  const [userId, setUserId] = useState(null); // Stocke l'ID de l'utilisateur connecté
  const router = useRouter(); // Initialise le routeur pour la navigation

  useEffect(() => {
    // ✅ Récupère le rôle de l'utilisateur stocké dans localStorage
    const storedRole = localStorage.getItem("role");
    const storedUser = localStorage.getItem("user");
    
    if (storedRole) {
      setUserRole(storedRole); // Met à jour l'état avec le rôle
    }
    
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.id); // Met à jour l'état avec l'ID utilisateur
    }

    // ✅ Requête fetch vers le backend pour récupérer la liste des tickets
    const fetchTickets = async () => {
      try {
        const response = await fetch("http://localhost:3000/tickets", {
          method: "GET", // Requête GET pour récupérer les tickets
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ Vérifie l'authentification
          },
        });

        if (!response.ok) {
          throw new Error("Accès refusé ou erreur serveur");
        }

        const data = await response.json();
        setTickets(data.tickets); // Stocke les tickets dans l'état
      } catch (err) {
        setError(err.message); // Stocke l'erreur en cas de problème
      } finally {
        setLoading(false); // Désactive l'affichage du chargement
      }
    };

    fetchTickets(); // Appelle la fonction pour récupérer les tickets
  }, []);

  // ✅ Trie les tickets à chaque fois que la liste des tickets change
  useEffect(() => {
    const sortTickets = () => {
      if (!tickets || tickets.length === 0) return [];

      // Séparer les tickets clôturés et non clôturés
      const closedTickets = tickets.filter(ticket => ticket.status === "clôturé");
      const activeTickets = tickets.filter(ticket => ticket.status !== "clôturé");

      // Trier les tickets actifs par date (du plus récent au plus ancien)
      const sortedActiveTickets = activeTickets.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA; // Ordre décroissant (du plus récent au plus ancien)
      });

      // Trier les tickets clôturés par date (du plus récent au plus ancien)
      const sortedClosedTickets = closedTickets.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA;
      });

      // Combiner les tickets actifs et clôturés
      return [...sortedActiveTickets, ...sortedClosedTickets];
    };

    setSortedTickets(sortTickets()); // Met à jour la liste triée
  }, [tickets]);

  // ✅ Fonction pour assigner un ticket à l'utilisateur connecté
  const handleAssignTicket = async (ticketId) => {
    try {
      // Vérifie si l'utilisateur est un technicien ou un administrateur
      if (userRole !== "Technicien" && userRole !== "Administrateur") {
        setError("Vous n'avez pas les droits pour assigner des tickets");
        return;
      }

      const response = await fetch(`http://localhost:3000/ticketsTechnicien/${ticketId}/assign`, {
        method: "PATCH", // Requête PATCH pour assigner le ticket
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ technicianId: userId }), // Envoie l'ID du technicien qui prend en charge le ticket
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'assignation du ticket");
      }

      // ✅ Redirige vers la liste des tickets personnels après assignation
      router.push(`/personalTicketsList`);
    } catch (err) {
      setError(err.message); // Stocke l'erreur en cas de problème
    }
  };

  // ✅ Vérifie si un ticket peut être assigné par l'utilisateur
  const canAssignTicket = (ticket) => {
    return (userRole === "Administrateur" || userRole === "Technicien") 
      && (ticket.status === "en attente" || ticket.status === "en cours" || !ticket.status);
  };

  if (loading) return <p className={styles.loading}>Chargement des tickets...</p>;
  if (error) return <p className={styles.error}>Erreur : {error}</p>;

  return (
    <div className={styles.container}>
      {/* ✅ Affichage dynamique du bon Header selon le rôle */}
      {userRole === "Administrateur" ? (
        <HeaderAdministrateur />
      ) : userRole === "Technicien" ? (
        <HeaderTechnicien />
      ) : (
        <p className={styles.error}>Accès refusé</p>
      )}

      {/* ✅ Affichage du contenu principal */}
      {userRole === "Administrateur" || userRole === "Technicien" ? (
        <div className={styles.content}>
          <h2 className={styles.title}>Liste des Tickets</h2>

          <div className={styles.ticketsContainer}>
            {tickets.length === 0 ? (
              <p className={styles.noTickets}>Aucun tickets.</p>
            ) : (
              <table className={styles.ticketsTable}>
                <thead>
                  <tr>
                    <th>Numéro</th>
                    <th>Date</th>
                    <th>Catégorie</th>
                    <th>Titre</th>
                    <th>Créé par</th>
                    <th>Statut</th>
                    <th>Assigné à</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTickets.map((ticket) => (
                    <tr key={ticket._id} className={ticket.status === "clôturé" ? styles.closedTicket : ""}>
                      <td>{ticket.ticketNumber}</td>
                      <td>{new Date(ticket.createdAt).toLocaleDateString("fr-FR")}</td>
                      <td>{ticket.category || "Demande"}</td>
                      <td>{ticket.title}</td>
                      <td>{ticket.userId?.username || "Inconnu"}</td>
                      <td>
                        {ticket.status === "clôturé" ? (
                          <span className={styles.closedLabel}>Clôturé</span>
                        ) : ticket.status === "en cours" ? (
                          <span className={styles.inProgressLabel}>En cours</span>
                        ) : (
                          <span className={styles.pendingLabel}>En attente</span>
                        )}
                      </td>
                      <td>{ticket.assignedTo ? ticket.assignedTo.username : "Non assigné"}</td>
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
                              Traiter
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default allTicketsList; // Exporte le composant pour être utilisé ailleurs
