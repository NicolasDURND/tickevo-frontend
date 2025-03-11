import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { logout } from "../../reducers/authentification"; // ✅ Vérifie le chemin exact !
import HeaderUser from "../../components/HeaderUser";
import styles from "../../styles/NewTicket.module.css";
import Footer from "../../components/Footer";

const NewTicket = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [description, setDescription] = useState("");
  const [ticketType, setTicketType] = useState(""); // ✅ Stocke la catégorie
  const [subCategory, setSubCategory] = useState(""); // ✅ Stocke la sous-catégorie (pour les incidents)
  const [category, setCategory] = useState(""); // ✅ Définit la catégorie principale (Demande ou Incident)

  useEffect(() => {
    if (router.query.category) {
      const selectedCategory = router.query.category;

      // 🔹 Déterminer si c'est une "Demande" ou un "Incident"
      const isIncident = [
        "Incident matériel",
        "Incident logiciel",
        "Incident autre",
        "Problème d'écran",
        "Problème de clavier",
        "Panne électrique",
        "Bug logiciel",
        "Problème d'accès",
        "Erreur système",
        "Problème réseau",
        "Problème de connexion VPN",
        "Autre",
      ].includes(selectedCategory);

      setCategory(isIncident ? "Incident" : "Demande");
      setTicketType(selectedCategory);

      // 🔹 Si c'est un incident, définir la sous-catégorie
      if (isIncident) {
        setSubCategory(selectedCategory);
      }
    }
  }, [router.query]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Vérifier si l'utilisateur est authentifié
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (!storedUser || !storedToken) {
      alert("Erreur : utilisateur non authentifié. Veuillez vous reconnecter.");
      dispatch(logout());
      router.push("/");
      return;
    }

    const user = JSON.parse(storedUser);
    console.log("🔍 Utilisateur récupéré :", user);
    console.log("🔍 Token récupéré :", storedToken);
    console.log("🔍 Catégorie principale :", category);
    console.log("🔍 Type de ticket :", ticketType);
    console.log("🔍 Sous-catégorie (si incident) :", subCategory);

    const ticketData = {
      title: ticketType,
      description,
      category, // ✅ Soit "Demande", soit "Incident"
      subcategories:
        category === "Incident"
          ? [{ subCategoryLevel: 1, subCategoryName: subCategory }]
          : [],
      createdBy: user.id,
      userId: user.id,
      status: "en cours", // ✅ Définir le statut initial à "en cours"
      ticketNumber: Math.floor(100000 + Math.random() * 900000), // ✅ Numéro unique
    };

    console.log("🚀 Envoi du ticket avec les données :", ticketData);

    try {
      const response = await fetch("http://localhost:3000/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`, // ✅ Ajout du token dans l'auth
        },
        body: JSON.stringify(ticketData),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("❌ Erreur de soumission :", result);
        throw new Error(
          result.message || "Erreur lors de la création du ticket"
        );
      }

      console.log("✅ Ticket créé avec succès :", result);
      alert("Ticket créé avec succès !");
      router.push("/home");
    } catch (error) {
      console.error("⚠️ Erreur d'authentification ou serveur :", error.message);

      if (
        error.message.includes("401") ||
        error.message.includes("Non authentifié")
      ) {
        alert("Session expirée, veuillez vous reconnecter.");
        dispatch(logout());
        router.push("/");
      } else {
        alert("Une erreur est survenue, veuillez réessayer.");
      }
    }
  };

  return (
    <div className={styles.pageContainer}>
      <HeaderUser />
      <div className={styles.content}>
        <h2 className={styles.title}>Créer un ticket</h2>

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
      <Footer />
    </div>
  );
};

export default NewTicket;
