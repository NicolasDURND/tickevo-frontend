import { useState, useEffect } from "react";
import { useRouter } from "next/router";

// Importation des composants d'en-tête en fonction du rôle de l'utilisateur
import HeaderTechnicien from "../components/HeaderTechnicien";
import HeaderAdministrateur from "../components/HeaderAdministrateur";
import HeaderUser from "../components/HeaderUser";

// Importation des styles CSS spécifiques à cette page
import styles from "../styles/TreatmentTicket.module.css";

// Définition du composant principal
const treatmentTicket = () => {
  // Déclaration des états du composant
  const [ticket, setTicket] = useState(null); // Stocke les informations du ticket
  const [loading, setLoading] = useState(true); // Indique si les données sont en cours de chargement
  const [error, setError] = useState(null); // Stocke le message d'erreur en cas de problème
  const [userRole, setUserRole] = useState(null); // Stocke le rôle de l'utilisateur connecté
  const [userId, setUserId] = useState(null); // Stocke l'ID de l'utilisateur connecté
  const [commentText, setCommentText] = useState(""); // Stocke le texte du commentaire à ajouter
  const [closeReason, setCloseReason] = useState(""); // Stocke la raison de clôture du ticket
  const [showCloseError, setShowCloseError] = useState(false); // Indique si une erreur doit être affichée lorsque la clôture est sans raison
  const [isPending, setIsPending] = useState(false); // Indique si le ticket est actuellement en attente

  // Utilisation du hook Next.js pour récupérer l'ID du ticket dans l'URL
  const router = useRouter();
  const { ticketId } = router.query; // Récupère `ticketId` depuis l'URL

  // Effet pour surveiller les changements du ticket et mettre à jour `isPending`
  useEffect(() => {
    if (ticket) {
      setIsPending(ticket.status === "en attente"); // Vérifie si le statut est "en attente"
    }
  }, [ticket]); // Exécuté chaque fois que `ticket` change

  // Effet pour récupérer les informations de l'utilisateur et charger le ticket
  useEffect(() => {
    //  Récupération des informations de l'utilisateur depuis le localStorage
    const storedRole = localStorage.getItem("role"); // Rôle de l'utilisateur
    const storedUser = localStorage.getItem("user"); // Données utilisateur (sous forme JSON)
    const token = localStorage.getItem("token"); // Token d'authentification pour l'API

    // Affiche les informations utilisateur dans la console (pour le débogage)
    console.log("[treatmentTicket] Informations utilisateur chargées:", {
      role: storedRole,
      token: token ? "Présent" : "Absent", // Vérifie si un token est disponible
    });

    // Stocke le rôle de l'utilisateur si disponible
    if (storedRole) {
      setUserRole(storedRole);
    }

    // Traitement des informations de l'utilisateur stockées
    if (storedUser) {
      try {
        // Parse le JSON pour récupérer les données utilisateur
        const user = JSON.parse(storedUser);
        const userIdentifier = user.id || user._id; // Utilise `id` ou `_id` selon le format des données
        setUserId(userIdentifier); // Stocke l'ID de l'utilisateur dans le state

        console.log("[treatmentTicket] User ID extrait:", userIdentifier);

        // Vérifie si le routeur est prêt et si un ticketId est présent avant d'effectuer une requête
        if (router.isReady && ticketId) {
          fetchTicket(ticketId, token); // Appelle la fonction pour récupérer le ticket
        }
      } catch (err) {
        // Gestion des erreurs si le JSON utilisateur est invalide
        console.log("[treatmentTicket] Erreur de parsing user:", err);
        setError("Erreur lors de la récupération des informations utilisateur");
        setLoading(false); // Arrête le chargement en cas d'erreur
      }
    }
  }, [router.isReady, ticketId, router]); // Déclenché lorsque `router.isReady`, `ticketId` ou `router` changent

  // Fonction asynchrone pour récupérer les données d'un ticket spécifique depuis l'API
  const fetchTicket = async (ticketId, token) => {
    try {
      //  Début du chargement : active l'état "loading" pour indiquer que la requête est en cours
      setLoading(true);

      console.log(
        "[treatmentTicket] Récupération du ticket spécifique:",
        ticketId
      );

      //  Envoi de la requête HTTP GET pour récupérer le ticket avec l'ID spécifié
      const response = await fetch(
        `https://tickevo-backend.vercel.app/tickets/${ticketId}`,
        {
          method: "GET", // Utilisation de la méthode GET pour récupérer les données
          headers: {
            "Content-Type": "application/json", // Spécifie le format des données attendues
            Authorization: `Bearer ${token}`, // Ajoute le token d'authentification à la requête
          },
        }
      );

      //  Log des informations sur la réponse de l'API pour faciliter le débogage
      console.log("[treatmentTicket] Réponse API ticket spécifique:", {
        status: response.status, // Statut HTTP de la réponse (ex: 200, 404, 500)
        ok: response.ok, // Indique si la réponse est valide (true/false)
      });

      //  Vérifie si la réponse est valide (status HTTP 200-299)
      if (!response.ok) {
        throw new Error(
          `Erreur lors de la récupération du ticket: ${response.status}`
        );
      }

      //  Convertit la réponse JSON en objet JavaScript
      const data = await response.json();

      //  Log des données du ticket pour contrôle
      console.log("[treatmentTicket] Données du ticket:", data);

      //  Mise à jour de l'état du ticket avec les données reçues
      setTicket(data);
    } catch (err) {
      //  Gestion des erreurs en cas d'échec de la requête
      console.log(
        "[treatmentTicket] Erreur récupération ticket spécifique:",
        err
      );
      setError(`Erreur: ${err.message}`); // Stocke le message d'erreur dans le state pour affichage
    } finally {
      //  Désactive l'état "loading" une fois la requête terminée (réussie ou échouée)
      setLoading(false);
    }
  };

  // Fonction pour mettre à jour le statut d'un ticket
  const handleUpdateStatus = async (ticketId, newStatus, redirect = false) => {
    try {
      //  Log pour suivre la mise à jour du statut du ticket
      console.log("[treatmentTicket] Mise à jour du statut:", {
        ticketId,
        newStatus,
      });

      //  Vérification : Si le ticket est clôturé, une raison de clôture est obligatoire
      if (newStatus === "clôturé" && !closeReason.trim()) {
        setShowCloseError(true); // Active l'affichage de l'erreur
        return; // Stoppe l'exécution de la fonction
      }

      //  Récupération du token d'authentification depuis le localStorage
      const token = localStorage.getItem("token");

      //  1. Si le ticket est clôturé, ajouter la raison comme un commentaire
      if (newStatus === "clôturé") {
        await fetch(
          `https://tickevo-backend.vercel.app/ticketsTechnicien/${ticketId}/comment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              userId, // Identifiant de l'utilisateur qui ferme le ticket
              message: closeReason, // Message de clôture ajouté comme commentaire
            }),
          }
        );
      }

      //  2. Mettre à jour le statut du ticket via une requête PATCH
      const response = await fetch(
        `https://tickevo-backend.vercel.app/ticketsTechnicien/${ticketId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus, // Nouveau statut du ticket
          }),
        }
      );

      //  Vérification si la requête a réussi
      if (!response.ok) {
        throw new Error(
          `Erreur lors de la mise à jour du statut: ${response.status}`
        );
      }

      //  Convertit la réponse JSON en objet JavaScript
      const updatedTicket = await response.json();

      //  Mise à jour de l'état local avec le ticket mis à jour
      setTicket(updatedTicket);

      //  Réinitialisation de la raison de clôture et suppression de l'erreur
      setCloseReason("");
      setShowCloseError(false);

      //  Met à jour l'état "isPending" si le ticket est mis en attente
      setIsPending(newStatus === "en attente");

      //  Rafraîchit la page si le paramètre `redirect` est activé
      if (redirect) {
        router.replace(router.asPath, undefined, { shallow: true });
      }
    } catch (err) {
      //  Gestion des erreurs : Affichage de l'erreur dans la console et mise à jour de l'état `error`
      console.log("[treatmentTicket] Erreur mise à jour statut:", err);
      setError(`Erreur: ${err.message}`);
    }
  };

  //  Fonction pour mettre le ticket en attente
  const handleSetPending = async () => {
    //  Met à jour le statut du ticket en "en attente"
    await handleUpdateStatus(ticket._id, "en attente");

    //  Met à jour l'état local pour indiquer que le ticket est en attente
    setIsPending(true); // Désactive les boutons "Réattribuer" et "Clôturer"

    //  Redirige l'utilisateur vers la liste de ses tickets personnels
    router.push(`/personalTicketsList`);
  };

  //  Fonction pour annuler la mise en attente du ticket et le remettre en cours
  const handleCancelPending = async () => {
    try {
      //  Log pour indiquer l'annulation de la mise en attente
      console.log(
        "[treatmentTicket] Annulation de la mise en attente du ticket:",
        ticket._id
      );

      //  Récupération du token d'authentification pour effectuer la requête API
      const token = localStorage.getItem("token");

      //  Envoi d'une requête PATCH pour mettre à jour le statut du ticket à "en cours"
      const response = await fetch(
        `https://tickevo-backend.vercel.app/ticketsTechnicien/${ticket._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "en cours" }), //  Envoie du nouveau statut
        }
      );

      //  Vérification si la requête a réussi
      if (!response.ok) {
        throw new Error(
          `Erreur lors de la mise à jour du statut: ${response.status}`
        );
      }

      //  Conversion de la réponse API en objet JavaScript
      const updatedTicket = await response.json();

      //  Log des nouvelles données du ticket après la mise à jour
      console.log(
        "[treatmentTicket] Ticket mis à jour après annulation de l'attente:",
        updatedTicket
      );

      //  Mise à jour de l'état local avec les nouvelles données du ticket
      setTicket(updatedTicket);

      //  Réactive les boutons "Réattribuer" et "Clôturer" en mettant `isPending` à false
      setIsPending(false);
    } catch (err) {
      //  Gestion des erreurs : affichage d'un message en cas d'échec
      console.log(
        "[treatmentTicket] Erreur lors de l'annulation de la mise en attente :",
        err
      );
      setError(`Erreur: ${err.message}`);
    }
  };

  //  Fonction pour réattribuer un ticket et réinitialiser son affectation
  const handleReassignAndSetStatus = async () => {
    try {
      //  Log pour indiquer le début du processus de réattribution
      console.log(
        "[treatmentTicket] Réattribution du ticket et réinitialisation de l'affectation..."
      );

      //  Récupération du token d'authentification depuis le localStorage
      const token = localStorage.getItem("token");

      //  Envoi d'une requête PATCH pour réinitialiser l'affectation du ticket
      const response = await fetch(
        `https://tickevo-backend.vercel.app/ticketsTechnicien/${ticket._id}/reassign`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newTechnicianId: null }), //  Met "assignedTo" à null (désaffecte le technicien)
        }
      );

      //  Vérification si la requête a réussi
      if (!response.ok) {
        throw new Error(
          `Erreur lors de la réattribution du ticket: ${response.status}`
        );
      }

      //  Mise à jour du statut du ticket en "en cours" après réattribution
      await handleUpdateStatus(ticket._id, "en cours", false);

      //  Redirection de l'utilisateur vers la liste de tous les tickets avec l'ID du ticket réattribué
      router.push(`/allTicketsList?reassign=${ticket._id}`);
    } catch (err) {
      //  Gestion des erreurs : affichage d'un message d'erreur si la réattribution échoue
      console.log("[treatmentTicket] Erreur lors de la réattribution :", err);
      setError(`Erreur: ${err.message}`);
    }
  };

  //  Fonction pour ajouter un commentaire à un ticket spécifique
  const handleAddComment = async (ticketId, message) => {
    //  Vérifie que le message n'est pas vide ou composé uniquement d'espaces
    if (!message.trim()) return;

    try {
      //  Log pour indiquer l'ajout d'un commentaire avec l'ID du ticket et le message
      console.log("[treatmentTicket] Ajout commentaire:", {
        ticketId,
        message,
      });

      //  Récupération du token d'authentification stocké dans le localStorage
      const token = localStorage.getItem("token");

      //  Envoi d'une requête POST à l'API pour ajouter un commentaire
      const response = await fetch(
        `https://tickevo-backend.vercel.app/ticketsTechnicien/${ticketId}/comment`,
        {
          method: "POST", // Utilisation de la méthode POST pour envoyer les données
          headers: {
            "Content-Type": "application/json", // Spécification du format des données
            Authorization: `Bearer ${token}`, // Ajout du token d'authentification
          },
          body: JSON.stringify({ userId, message }), // Envoi du commentaire avec l'ID de l'utilisateur
        }
      );

      //  Vérification si la requête a réussi
      if (!response.ok) {
        throw new Error(
          `Erreur lors de l'ajout du commentaire: ${response.status}`
        );
      }

      //  Convertit la réponse API en objet JavaScript
      const updatedTicket = await response.json();

      //  Met à jour l'état du ticket avec les nouvelles données
      setTicket(updatedTicket);

      //  Réinitialise le champ du commentaire après l'ajout
      setCommentText("");
    } catch (err) {
      //  Gestion des erreurs : affichage d'un message d'erreur si l'ajout échoue
      console.log("[treatmentTicket] Erreur ajout commentaire:", err);
      setError(`Erreur: ${err.message}`);
    }
  };

  //  Vérifie si les données du ticket sont en cours de chargement
  if (loading) {
    return (
      <div className={styles.main}>
        {/*  Affichage dynamique du bon Header en fonction du rôle de l'utilisateur */}
        {userRole === "Administrateur" ? (
          <HeaderAdministrateur />
        ) : userRole === "Technicien" ? (
          <HeaderTechnicien />
        ) : (
          <HeaderUser />
        )}

        {/*  Affichage d'un message indiquant que le ticket est en cours de chargement */}
        <div className={styles.loading}>Chargement du ticket...</div>
      </div>
    );
  }

  //  Vérifie si le ticket n'existe pas ou n'a pas été trouvé
  if (!ticket) {
    return (
      <div className={styles.main}>
        {/*  Affichage dynamique du bon Header en fonction du rôle de l'utilisateur */}
        {userRole === "Administrateur" ? (
          <HeaderAdministrateur />
        ) : userRole === "Technicien" ? (
          <HeaderTechnicien />
        ) : (
          <HeaderUser />
        )}

        <div className={styles.container}>
          {/*  Message d'erreur indiquant que le ticket est introuvable */}
          <h1 className={styles.title}>Ticket non trouvé</h1>

          {/*  Affiche un message d'erreur détaillé si une erreur est survenue */}
          {error && <p className={styles.error}>{error}</p>}

          {/*  Bouton permettant de retourner à la liste des tickets */}
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
      {/*  Affichage dynamique du bon Header en fonction du rôle de l'utilisateur */}
      {userRole === "Administrateur" ? (
        <HeaderAdministrateur />
      ) : userRole === "Technicien" ? (
        <HeaderTechnicien />
      ) : (
        <HeaderUser />
      )}

      <div className={styles.container}>
        {/*  En-tête du ticket avec son numéro et son titre */}
        <div className={styles.ticketHeader}>
          <h1 className={styles.title}>
            Ticket N°{ticket.ticketNumber} - {ticket.title}
          </h1>
        </div>

        {/*  Bouton de retour en bas à gauche pour revenir à la liste des tickets */}
        <div className={styles.backButtonContainer}>
          <button
            className={styles.backButton}
            onClick={() => router.push("/allTicketsList")}
          >
            Retour à la liste des tickets
          </button>
        </div>

        {/*  Section affichant la description du ticket */}
        <div className={styles.sectionBox}>
          <h2 className={styles.sectionTitle}>Description du ticket</h2>
          <div className={styles.descriptionBox}>
            <p>{ticket.description}</p>
          </div>
        </div>

        {/*  Section des actions disponibles sur le ticket */}
        <div className={styles.sectionBox}>
          <h2 className={styles.sectionTitle}>Actions</h2>

          {/*  Vérifie si le ticket est toujours actif (non clôturé) */}
          {ticket.status !== "clôturé" ? (
            <div className={styles.actionsContainer}>
              {/*  Message d'erreur si l'utilisateur essaie de clôturer sans fournir de raison */}
              {showCloseError && (
                <p className={styles.error}>
                  Veuillez entrer une explication avant de clôturer le ticket.
                </p>
              )}

              {/*  Zone de texte pour saisir la raison de clôture */}
              <textarea
                className={styles.textarea}
                placeholder="Expliquez les raisons de la clôture du ticket..."
                value={closeReason}
                onChange={(e) => setCloseReason(e.target.value)}
              />

              {/*  Boutons d'action disponibles pour le ticket */}
              <div className={styles.actionButtons}>
                {/*  Bouton pour mettre le ticket en attente (désactivé s'il est déjà en attente) */}
                <button
                  className={styles.pendingButton}
                  onClick={handleSetPending}
                  disabled={isPending} // Désactivé si le ticket est déjà en attente
                >
                  Mettre en attente
                </button>

                {/*  Bouton pour annuler la mise en attente (désactivé si le ticket n'est pas en attente) */}
                <button
                  className={styles.cancelPendingButton}
                  onClick={handleCancelPending}
                  disabled={!isPending} // Désactivé si le ticket n'est pas en attente
                >
                  Annuler la mise en attente
                </button>

                {/*  Bouton pour réattribuer le ticket (désactivé si en attente) */}
                <button
                  className={styles.reassignButton}
                  onClick={handleReassignAndSetStatus}
                  disabled={isPending} // Désactivé si le ticket est en attente
                >
                  Réattribuer
                </button>

                {/*  Bouton pour clôturer le ticket (désactivé si en attente) */}
                <button
                  className={styles.closeButton}
                  onClick={() =>
                    handleUpdateStatus(ticket._id, "clôturé", true)
                  }
                  disabled={isPending} // Désactivé si le ticket est en attente
                >
                  Clôturer
                </button>
              </div>
            </div>
          ) : (
            //  Message indiquant que le ticket est clôturé
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
