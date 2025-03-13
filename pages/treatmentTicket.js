import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import HeaderTechnicien from "../components/HeaderTechnicien";
import HeaderAdministrateur from "../components/HeaderAdministrateur";
import HeaderUser from "../components/HeaderUser";
import styles from "../styles/TreatmentTicket.module.css";

const treatmentTicket = () => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [closeReason, setCloseReason] = useState("");
  const [showCloseError, setShowCloseError] = useState(false);
  const [isPending, setIsPending] = useState(false); // ✅ État pour gérer la mise en attente
  const router = useRouter();
  const { ticketId } = router.query;

  useEffect(() => {
    if (ticket) {
      setIsPending(ticket.status === "en attente"); // ✅ Met à jour l'état "en attente"
    }
  }, [ticket]); // ✅ Dépend de `ticket`, s'exécute après chaque mise à jour

  useEffect(() => {
    // ✅ Récupère les informations de l'utilisateur depuis localStorage
    const storedRole = localStorage.getItem("role");
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    console.log("[treatmentTicket] Informations utilisateur chargées:", {
      role: storedRole,
      token: token ? "Présent" : "Absent",
    });

    if (storedRole) {
      setUserRole(storedRole);
    }

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const userIdentifier = user.id || user._id;
        setUserId(userIdentifier);

        console.log("[treatmentTicket] User ID extrait:", userIdentifier);

        if (router.isReady && ticketId) {
          fetchTicket(ticketId, token);
        }
      } catch (err) {
        console.log("[treatmentTicket] Erreur de parsing user:", err);
        setError("Erreur lors de la récupération des informations utilisateur");
        setLoading(false);
      }
    }
  }, [router.isReady, ticketId, router]);

  const fetchTicket = async (ticketId, token) => {
    try {
      setLoading(true);
      console.log(
        "[treatmentTicket] Récupération du ticket spécifique:",
        ticketId
      );

      const response = await fetch(
        `http://localhost:3000/tickets/${ticketId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("[treatmentTicket] Réponse API ticket spécifique:", {
        status: response.status,
        ok: response.ok,
      });

      if (!response.ok) {
        throw new Error(
          `Erreur lors de la récupération du ticket: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("[treatmentTicket] Données du ticket:", data);

      setTicket(data);
    } catch (err) {
      console.log(
        "[treatmentTicket] Erreur récupération ticket spécifique:",
        err
      );
      setError(`Erreur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (ticketId, newStatus, redirect = false) => {
    try {
      console.log("[treatmentTicket] Mise à jour du statut:", {
        ticketId,
        newStatus,
      });

      if (newStatus === "clôturé" && !closeReason.trim()) {
        setShowCloseError(true);
        return;
      }

      const token = localStorage.getItem("token");

      // ✅ 1. Ajouter le message de clôture dans les commentaires du ticket
      if (newStatus === "clôturé") {
        await fetch(
          `http://localhost:3000/ticketsTechnicien/${ticketId}/comment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              userId,
              message: closeReason, // ✅ Sauvegarde le message comme un commentaire
            }),
          }
        );
      }

      // ✅ 2. Mettre à jour le statut du ticket
      const response = await fetch(
        `http://localhost:3000/ticketsTechnicien/${ticketId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Erreur lors de la mise à jour du statut: ${response.status}`
        );
      }

      const updatedTicket = await response.json();
      setTicket(updatedTicket);
      setCloseReason("");
      setShowCloseError(false);
      setIsPending(newStatus === "en attente");

      // Rafraîchit la page si redirect est true
      if (redirect) {
        router.replace(router.asPath, undefined, { shallow: true });
        }

    } catch (err) {
      console.log("[treatmentTicket] Erreur mise à jour statut:", err);
      setError(`Erreur: ${err.message}`);
    }
  };

  const handleSetPending = async () => {
    await handleUpdateStatus(ticket._id, "en attente");
    setIsPending(true); // Désactive "Réattribuer" et "Clôturer"
    router.push(`/personalTicketsList`); // Redirige après la mise en attente
  };

  // ✅ Fonction pour annuler la mise en attente et réactiver les boutons
  const handleCancelPending = async () => {
    try {
      console.log(
        "[treatmentTicket] Annulation de la mise en attente du ticket:",
        ticket._id
      );

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3000/ticketsTechnicien/${ticket._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "en cours" }), // ✅ Envoie bien le nouveau statut "en cours"
        }
      );

      if (!response.ok) {
        throw new Error(
          `Erreur lors de la mise à jour du statut: ${response.status}`
        );
      }

      const updatedTicket = await response.json();
      console.log(
        "[treatmentTicket] Ticket mis à jour après annulation de l'attente:",
        updatedTicket
      );

      // ✅ Met à jour l'état local du ticket pour actualiser l'affichage
      setTicket(updatedTicket);
      setIsPending(false); // Réactive "Réattribuer" et "Clôturer"
    } catch (err) {
      console.log(
        "[treatmentTicket] Erreur lors de l'annulation de la mise en attente :",
        err
      );
      setError(`Erreur: ${err.message}`);
    }
  };

  const handleReassignAndSetStatus = async () => {
    try {
      console.log(
        "[treatmentTicket] Réattribution du ticket et réinitialisation de l'affectation..."
      );

      const token = localStorage.getItem("token");

      // ✅ Envoyer une requête pour réinitialiser assignedTo à null
      const response = await fetch(
        `http://localhost:3000/ticketsTechnicien/${ticket._id}/reassign`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newTechnicianId: null }), // ✅ Réinitialisation
        }
      );

      if (!response.ok) {
        throw new Error(
          `Erreur lors de la réattribution du ticket: ${response.status}`
        );
      }

      // ✅ Mettre à jour l'état local et rediriger
      await handleUpdateStatus(ticket._id, "en cours", false);
      router.push(`/allTicketsList?reassign=${ticket._id}`);
    } catch (err) {
      console.log("[treatmentTicket] Erreur lors de la réattribution :", err);
      setError(`Erreur: ${err.message}`);
    }
  };

  // ✅ Fonction pour ajouter un commentaire à un ticket
  const handleAddComment = async (ticketId, message) => {
    if (!message.trim()) return;

    try {
      console.log("[treatmentTicket] Ajout commentaire:", {
        ticketId,
        message,
      });
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3000/ticketsTechnicien/${ticketId}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId, message }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Erreur lors de l'ajout du commentaire: ${response.status}`
        );
      }

      // ✅ Rafraîchir le ticket après l'ajout du commentaire
      const updatedTicket = await response.json();
      setTicket(updatedTicket);
      setCommentText("");
    } catch (err) {
      console.log("[treatmentTicket] Erreur ajout commentaire:", err);
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
            onClick={() => router.push("/allTicketsList")}
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
            onClick={() => router.push("/allTicketsList")}
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
                <p className={styles.error}>
                  Veuillez entrer une explication avant de clôturer le ticket.
                </p>
              )}
              <textarea
                className={styles.textarea}
                placeholder="Expliquez les raisons de la clôture du ticket..."
                value={closeReason}
                onChange={(e) => setCloseReason(e.target.value)}
              />
              <div className={styles.actionButtons}>
                {/* ✅ Bouton Mettre en attente (Désactivé si déjà en attente) */}
                <button
                  className={styles.pendingButton}
                  onClick={handleSetPending}
                  disabled={isPending}
                >
                  Mettre en attente
                </button>

                {/* ✅ Bouton Annuler la mise en attente (Désactivé si pas en attente) */}
                <button
                  className={styles.cancelPendingButton}
                  onClick={handleCancelPending}
                  disabled={!isPending}
                >
                  Annuler la mise en attente
                </button>

                {/* ✅ Bouton Réattribuer (Désactivé si en attente) */}
                <button
                  className={styles.reassignButton}
                  onClick={handleReassignAndSetStatus}
                  disabled={isPending}
                >
                  Réattribuer
                </button>

                {/* ✅ Bouton Clôturer (Désactivé si en attente) */}
                <button
                  className={styles.closeButton}
                  onClick={() =>
                    handleUpdateStatus(ticket._id, "clôturé", true)
                  }
                  disabled={isPending}
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
          <h2 className={styles.sectionTitle}>Message de clôture :</h2>
          <div className={styles.historyContainer}>
            {ticket.comments && ticket.comments.length > 0 ? (
              ticket.comments.map((comment, index) => (
                <div key={index} className={styles.historyItem}>
                  <div className={styles.commentHeader}>
                    <span className={styles.commentDate}>
                      le &nbsp;
                      {new Date(comment.timestamp).toLocaleDateString()}{" "}
                      {/* Ajout de l'espace */}
                      {" à "}
                      {new Date(comment.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>{" "}
                    De : &nbsp;{/* Séparateur entre la date et le username */}
                    <span className={styles.commentAuthor}>
                      {comment.userId?.username || "Utilisateur inconnu"}
                    </span>
                  </div>
                  <div className={styles.commentContent}>{comment.message}</div>
                </div>
              ))
            ) : (
              <p className={styles.noComments}>
                Aucun commentaire pour le moment.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default treatmentTicket;
