import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import HeaderUser from "../../components/HeaderUser";
import styles from "../../styles/NewTicket.module.css";

const NewTicket = () => {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [ticketType, setTicketType] = useState("");

  useEffect(() => {
    if (router.query.category) {
      setTicketType(router.query.category);
    }
  }, [router.query]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId"); // ✅ Récupère l'ID de l'utilisateur connecté

    const ticketData = {
      title: ticketType,
      description,
      category: ticketType, // ✅ Correspond à "Demande" ou "Incident"
      userId, // ✅ Ajout de userId obligatoire
    };
    console.log("Ticket envoyé:", ticketData);

    try {
      const response = await fetch("http://localhost:3000/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticketData),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création du ticket");
      }

      alert("Ticket créé avec succès !");
      router.push("/home");
    } catch (error) {
      console.error("Erreur :", error);
      alert("Une erreur est survenue, veuillez réessayer.");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <HeaderUser />
      <div className={styles.content}>
        <h2 className={styles.title}>Créer une demande</h2>

        <div className={styles.card}>
          <h3 className={styles.object}>
            <strong>Objet :</strong> {ticketType}
          </h3>

          <textarea
            className={styles.textarea}
            placeholder="Expliquez votre demande..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>

          <div className={styles.buttonContainer}>
            <button
              className={styles.cancelButton}
              onClick={() => router.push("/home")}
            >
              Annuler
            </button>
            <button className={styles.submitButton} onClick={handleSubmit}>
              Soumettre
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTicket;
