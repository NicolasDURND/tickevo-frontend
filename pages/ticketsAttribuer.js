import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import HeaderTechnicien from "../components/HeaderTechnicien";
import HeaderAdministrateur from "../components/HeaderAdministrateur";
import HeaderUser from "../components/HeaderUser";
import styles from "../styles/ticketsAttribuer.module.css";

const TicketsAttribuer = () => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [closeReason, setCloseReason] = useState("");
  const [showCloseError, setShowCloseError] = useState(false);
  const router = useRouter();
  const { ticketId } = router.query;

  useEffect(() => {
    // ✅ Récupère les informations de l'utilisateur depuis localStorage
    const storedRole = localStorage.getItem("role");
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    console.log("[TicketsAttribuer] Informations utilisateur chargées:", { 
      role: storedRole, 
      token: token ? "Présent" : "Absent" 
    });
    
    if (storedRole) {
      setUserRole(storedRole);
    }
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const userIdentifier = user.id || user._id;
        setUserId(userIdentifier);
        
        console.log("[TicketsAttribuer] User ID extrait:", userIdentifier);
        
        if (router.isReady && ticketId) {
          fetchTicket(ticketId, token);
        }
      } catch (err) {
        console.log("[TicketsAttribuer] Erreur de parsing user:", err);
        setError("Erreur lors de la récupération des informations utilisateur");
        setLoading(false);
      }
    }
  }, [router.isReady, ticketId, router]);

  const fetchTicket = async (ticketId, token) => {
    try {
      setLoading(true);
      console.log("[TicketsAttribuer] Récupération du ticket spécifique:", ticketId);
      
      const response = await fetch(`http://localhost:3000/tickets/${ticketId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      console.log("[TicketsAttribuer] Réponse API ticket spécifique:", { 
        status: response.status, 
        ok: response.ok 
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération du ticket: ${response.status}`);
      }

      const data = await response.json();
      console.log("[TicketsAttribuer] Données du ticket:", data);
      
      setTicket(data);
    } catch (err) {
      console.log("[TicketsAttribuer] Erreur récupération ticket spécifique:", err);
      setError(`Erreur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fonction pour mettre à jour le statut d'un ticket
  const handleUpdateStatus = async (ticketId, newStatus, redirect = false) => {
    try {
      console.log("[TicketsAttribuer] Mise à jour du statut:", { ticketId, newStatus });
      
      // Vérifier si c'est une clôture et si une raison est fournie
      if (newStatus === "clôturé" && !closeReason.trim()) {
        setShowCloseError(true);
        return;
      }
      
      const token = localStorage.getItem("token");
      
      const response = await fetch(`http://localhost:3000/ticketsTechnicien/${ticketId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          status: newStatus,
          closeReason: closeReason
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la mise à jour du statut: ${response.status}`);
      }

      // ✅ Rediriger vers ViewTickets si demandé, sinon mettre à jour l'état local
      if (redirect) {
        router.push("/ViewTickets");
      } else {
        // ✅ Mettre à jour l'état local après la mise à jour réussie
        const updatedTicket = await response.json();
        setTicket(updatedTicket);
        setCloseReason("");
        setShowCloseError(false);
      }
    } catch (err) {
      console.log("[TicketsAttribuer] Erreur mise à jour statut:", err);
      setError(`Erreur: ${err.message}`);
    }
  };

  // ✅ Fonction pour mettre le ticket en attente
  const handleSetPending = async () => {
    await handleUpdateStatus(ticket._id, "en attente", true);
  };

  // ✅ Fonction pour mettre le ticket en cours (lors de la réattribution)
  const handleReassignAndSetStatus = async () => {
    try {
      await handleUpdateStatus(ticket._id, "en cours", false);
      router.push(`/ViewTickets?reassign=${ticket._id}`);
    } catch (err) {
      setError(`Erreur: ${err.message}`);
    }
  };

  // ✅ Fonction pour ajouter un commentaire à un ticket
  const handleAddComment = async (ticketId, message) => {
    if (!message.trim()) return;
    
    try {
      console.log("[TicketsAttribuer] Ajout commentaire:", { ticketId, message });
      const token = localStorage.getItem("token");
      
      const response = await fetch(`http://localhost:3000/ticketsTechnicien/${ticketId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, message }),
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de l'ajout du commentaire: ${response.status}`);
      }

      // ✅ Rafraîchir le ticket après l'ajout du commentaire
      const updatedTicket = await response.json();
      setTicket(updatedTicket);
      setCommentText("");
    } catch (err) {
      console.log("[TicketsAttribuer] Erreur ajout commentaire:", err);
      setError(`Erreur: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className={styles.main}>
        {/* ✅ Affichage dynamique du bon Header */}
        {userRole === "Administrateur" ? (
          <HeaderAdministrateur />
        ) : userRole === "Technicien" ? (
          <HeaderTechnicien />
        ) : (
          <HeaderUser />
        )}
        <div className={styles.loading}>Chargement du ticket...</div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className={styles.main}>
        {/* ✅ Affichage dynamique du bon Header */}
        {userRole === "Administrateur" ? (
          <HeaderAdministrateur />
        ) : userRole === "Technicien" ? (
          <HeaderTechnicien />
        ) : (
          <HeaderUser />
        )}
        <div className={styles.container}>
          <h1 className={styles.title}>Ticket non trouvé</h1>
          {error && <p className={styles.error}>{error}</p>}
          <button 
            className={styles.backButton}
            onClick={() => router.push("/ViewTickets")}
          >
            Retour à la liste des tickets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.main}>
      {/* ✅ Affichage dynamique du bon Header */}
      {userRole === "Administrateur" ? (
        <HeaderAdministrateur />
      ) : userRole === "Technicien" ? (
        <HeaderTechnicien />
      ) : (
        <HeaderUser />
      )}
      
      <div className={styles.container}>
        <div className={styles.ticketHeader}>
          <h1 className={styles.title}>
            Ticket N°{ticket.ticketNumber} - {ticket.title}
          </h1>
        </div>
        
        {/* Bouton de retour en bas à gauche */}
        <div className={styles.backButtonContainer}>
          <button 
            className={styles.backButton}
            onClick={() => router.push("/ViewTickets")}
          >
            Retour à la liste des tickets
          </button>
        </div>
        
        <div className={styles.sectionBox}>
          <h2 className={styles.sectionTitle}>Description du ticket</h2>
          <div className={styles.descriptionBox}>
            <p>{ticket.description}</p>
          </div>
        </div>
        
        <div className={styles.sectionBox}>
          <h2 className={styles.sectionTitle}>Actions</h2>
          {ticket.status !== "clôturé" ? (
            <div className={styles.actionsContainer}>
              {showCloseError && (
                <p className={styles.error}>Veuillez entrer une explication avant de clôturer le ticket.</p>
              )}
              <textarea 
                className={styles.textarea}
                placeholder="Expliquez les raisons de la clôture du ticket..."
                value={closeReason}
                onChange={(e) => setCloseReason(e.target.value)}
              />
              <div className={styles.actionButtons}>
                <button 
                  className={`${styles.pendingButton} ${styles.orangeButton}`}
                  onClick={handleSetPending}
                >
                  Mettre en attente
                </button>
                <button 
                  className={styles.reassignButton}
                  onClick={handleReassignAndSetStatus}
                >
                  Réattribuer
                </button>
                <button 
                  className={styles.closeButton}
                  onClick={() => handleUpdateStatus(ticket._id, "clôturé", true)}
                >
                  Clôturer
                </button>
              </div>
            </div>
          ) : (
            <p className={styles.closedMessage}>Ce ticket est clôturé.</p>
          )}
        </div>
        
        <div className={styles.sectionBox}>
          <h2 className={styles.sectionTitle}>Historique</h2>
          <div className={styles.historyContainer}>
            {ticket.comments && ticket.comments.length > 0 ? (
              ticket.comments.map((comment, index) => (
                <div key={index} className={styles.historyItem}>
                  <div className={styles.commentHeader}>
                    <span className={styles.commentDate}>
                      {new Date(comment.createdAt).toLocaleDateString()} {new Date(comment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                    <span className={styles.commentAuthor}>
                      {comment.userId?.username || comment.author || "utilisateur"}
                    </span>
                    <span className={styles.commentLabel}>
                      {comment.type || "Commentaire"}
                    </span>
                  </div>
                  <div className={styles.commentContent}>
                    {comment.message}
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.noComments}>Aucun commentaire pour le moment.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketsAttribuer;
