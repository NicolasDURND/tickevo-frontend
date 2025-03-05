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
    const response = await fetch("http://localhost:3000/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: ticketType, description }),
    });

    if (response.ok) {
      alert("Ticket créé avec succès !");
      router.push("/home");
    } else {
      alert("Erreur lors de la création du ticket");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <HeaderUser />

      <div className={styles.content}>
        <h2 className={styles.title}>Ma demande</h2>

        <div className={styles.card}>
          <h3 className={styles.object}>
            <strong>Objet :</strong> {ticketType}
          </h3>

          {/* ✅ Simple textarea au lieu du Rich Text Editor */}
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
