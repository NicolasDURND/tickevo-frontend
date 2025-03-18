import React, { useEffect, useState } from "react"; // Import React et ses hooks useEffect et useState
import { useRouter } from "next/router"; // Import du hook useRouter de Next.js pour la gestion des routes
import styles from "../../styles/TicketDetails.module.css"; // Import du fichier CSS spécifique à ce composant

// Composant principal pour afficher les détails d'un ticket
const TicketDetails = () => {
  const router = useRouter(); // Initialise le routeur pour accéder aux paramètres d'URL
  const { id } = router.query; // Récupère l'ID du ticket depuis l'URL
  const [ticket, setTicket] = useState(null); // État pour stocker les informations du ticket

  // Récupération du token stocké dans le navigateur (si disponible)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // useEffect s'exécute lorsqu'un nouvel ID est détecté
  useEffect(() => {
    if (id) {
      // Fonction asynchrone pour récupérer les détails du ticket
      const fetchTicket = async () => {
        try {
          const response = await fetch(`http://localhost:3000/tickets/${id}`, {
            method: "GET", // Requête GET pour obtenir les données du ticket
            headers: {
              "Content-Type": "application/json", // Indique que les données sont en JSON
              Authorization: `Bearer ${token}`, // Ajoute le token dans l'en-tête pour l'authentification
            },
          });

          // Vérifie si la requête a réussi
          if (!response.ok) {
            throw new Error(
              `Erreur API: ${response.status} ${response.statusText}` // Affiche l'erreur si la requête échoue
            );
          }

          const data = await response.json(); // Convertit la réponse en JSON
          setTicket(data); // Met à jour l'état avec les données du ticket
        } catch (error) {
          console.error("❌ Erreur lors de la récupération du ticket :", error); // Affiche une erreur en console
        }
      };

      fetchTicket(); // Appelle la fonction pour récupérer les données du ticket
    }
  }, [id]); // useEffect dépend de l'ID du ticket, il se met à jour si l'ID change

  // Affichage du message de chargement si le ticket n'est pas encore récupéré
  if (!ticket) {
    return <p className={styles.loading}>Chargement du ticket...</p>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Détails du Ticket</h2>

      <div className={styles.card}>
        <p>
          <strong>Numéro :</strong> {ticket.ticketNumber} {/* Affiche le numéro du ticket */}
        </p>
        <p>
          <strong>Créé par :</strong> {ticket.createdBy.username} {/* Affiche le nom du créateur */}
        </p>
        <p>
          <strong>Date :</strong>{" "}
          {new Date(ticket.createdAt).toLocaleDateString()} {/* Affiche la date de création */}
        </p>
        <p>
          <strong>Type :</strong> {ticket.category} {/* Affiche la catégorie du ticket */}
        </p>
        <p>
          <strong>Statut :</strong>{" "}
          <span
            className={`${styles.status} ${styles[ticket.status.toLowerCase()]}`}
          >
            {ticket.status} {/* Affiche le statut du ticket avec une classe CSS dynamique */}
          </span>
        </p>
        <p>
          <strong>Description :</strong> {ticket.description} {/* Affiche la description du ticket */}
        </p>
        {ticket.response && ( // Affiche la réponse uniquement si elle existe
          <p>
            <strong>Réponse :</strong> {ticket.response}
          </p>
        )}
      </div>

      {/* Bouton pour retourner à la page d'accueil */}
      <button
        className={styles.backButton}
        onClick={() => router.push("/home")}
      >
        ← Retour à l'accueil
      </button>
    </div>
  );
};

export default TicketDetails; // Exporte le composant pour être utilisé ailleurs