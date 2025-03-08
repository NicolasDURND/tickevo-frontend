import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/TicketDetails.module.css"; // ✅ On crée le CSS après

const TicketDetails = () => {
  const router = useRouter();
  const { id } = router.query; // ✅ Récupère l'ID du ticket depuis l'URL
  const [ticket, setTicket] = useState(null);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (id) {
      const fetchTicket = async () => {
        try {
          const response = await fetch(`http://localhost:3000/tickets/${id}`, {
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
          setTicket(data);
        } catch (error) {
          console.error("❌ Erreur lors de la récupération du ticket :", error);
        }
      };

      fetchTicket();
    }
  }, [id]);

  if (!ticket) {
    return <p className={styles.loading}>Chargement du ticket...</p>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Détails du Ticket</h2>

      <div className={styles.card}>
        <p>
          <strong>Numéro :</strong> {ticket.ticketNumber}
        </p>
        <p>
          <strong>Créé par :</strong> {ticket.createdBy.username}
        </p>
        <p>
          <strong>Date :</strong>{" "}
          {new Date(ticket.createdAt).toLocaleDateString()}
        </p>
        <p>
          <strong>Type :</strong> {ticket.category}
        </p>
        <p>
          <strong>Statut :</strong>{" "}
          <span
            className={`${styles.status} ${
              styles[ticket.status.toLowerCase()]
            }`}
          >
            {ticket.status}
          </span>
        </p>
        <p>
          <strong>Description :</strong> {ticket.description}
        </p>
        {ticket.response && (
          <p>
            <strong>Réponse :</strong> {ticket.response}
          </p>
        )}
      </div>

      <button
        className={styles.backButton}
        onClick={() => router.push("/home")}
      >
        ← Retour à l'accueil
      </button>
    </div>
  );
};

export default TicketDetails;
