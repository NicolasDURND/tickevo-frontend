import React, { useState, useEffect } from "react"; // Import React et ses hooks useState et useEffect
import { useRouter } from "next/router"; // Import du hook useRouter pour gérer la navigation
import { useDispatch } from "react-redux"; // Import du hook useDispatch pour modifier l'état global Redux
import { logout } from "../../reducers/authentification"; // Import de l'action de déconnexion

// Import des composants d'en-tête en fonction du rôle de l'utilisateur
import HeaderUser from "../../components/HeaderUser";
import HeaderTechnicien from "../../components/HeaderTechnicien";
import HeaderAdministrateur from "../../components/HeaderAdministrateur";
import styles from "../../styles/NewTicket.module.css"; // Import du fichier CSS
import Footer from "../../components/Footer"; // Import du composant Footer

// Composant principal pour créer un nouveau ticket
const NewTicket = () => {
  const router = useRouter(); // Initialise le routeur pour gérer la navigation
  const dispatch = useDispatch(); // Initialise Redux pour envoyer des actions

  const [userRole, setUserRole] = useState(null); // Stocke le rôle de l'utilisateur
  const [description, setDescription] = useState(""); // Stocke la description du ticket
  const [ticketType, setTicketType] = useState(""); // Stocke la catégorie du ticket
  const [subCategory, setSubCategory] = useState(""); // Stocke la sous-catégorie si nécessaire
  const [category, setCategory] = useState(""); // Stocke la catégorie principale (Demande ou Incident)

  // Récupère le rôle de l'utilisateur depuis le stockage local au chargement du composant
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  // Vérifie si une catégorie a été sélectionnée depuis l'URL et l'assigne correctement
  useEffect(() => {
    if (router.query.category) {
      const selectedCategory = router.query.category;

      // 🔹 Définition des catégories d'incidents avec leurs sous-catégories
      const incidentCategories = {
        "Incident matériel": [
          "Problème d'écran",
          "Problème de clavier",
          "Panne électrique",
          "Autre",
        ],
        "Incident logiciel": [
          "Bug logiciel",
          "Problème d'accès",
          "Erreur système",
        ],
        "Incident autre": [
          "Problème réseau",
          "Problème de connexion VPN",
          "Autre",
        ],
      };

      let foundCategory = "Demande"; // Par défaut, considère la catégorie comme une "Demande"
      let foundSubCategory = "";

      // 🔍 Vérifie si la catégorie sélectionnée appartient aux incidents
      for (const [mainCategory, subCategories] of Object.entries(
        incidentCategories
      )) {
        if (mainCategory === selectedCategory) {
          foundCategory = "Incident"; //  C'est un incident
          foundSubCategory = ""; //  Pas de sous-catégorie sélectionnée
          break;
        } else if (subCategories.includes(selectedCategory)) {
          foundCategory = "Incident";
          foundSubCategory = selectedCategory; //  Définit la sous-catégorie sélectionnée
          setTicketType(mainCategory); //  Définit `ticketType` comme la catégorie principale
          break;
        }
      }

      setCategory(foundCategory);
      setSubCategory(foundSubCategory);

      if (foundSubCategory === "") {
        setTicketType(selectedCategory); //  Si pas de sous-catégorie, `ticketType` reste inchangé
      }
    }
  }, [router.query]);

  // Fonction pour gérer l'envoi du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    //  Vérifie si l'utilisateur est authentifié
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (!storedUser || !storedToken) {
      alert("Erreur : utilisateur non authentifié. Veuillez vous reconnecter.");
      dispatch(logout()); // Déconnecte l'utilisateur
      router.push("/"); // Redirige vers la page d'accueil
      return;
    }

    const user = JSON.parse(storedUser); // Convertit l'utilisateur en objet JS
    console.log("🔍 Utilisateur récupéré :", user);
    console.log("🔍 Token récupéré :", storedToken);
    console.log("🔍 Catégorie principale :", category);
    console.log("🔍 Type de ticket :", ticketType);
    console.log("🔍 Sous-catégorie (si incident) :", subCategory);

    // Création de l'objet contenant les données du ticket
    const ticketData = {
      title: ticketType, // Définit le titre du ticket
      description, // Contenu de la demande
      category, //  "Demande" ou "Incident"
      subcategories:
        category === "Incident"
          ? [{ subCategoryLevel: 1, subCategoryName: subCategory }] // Si incident, ajoute la sous-catégorie
          : [],
      createdBy: user.id, // ID de l'utilisateur
      userId: user.id, // ID de l'utilisateur
      status: "en cours", //  Définit le statut initial à "en cours"
      ticketNumber: Math.floor(100000 + Math.random() * 900000), //  Génère un numéro unique
    };

    console.log("🚀 Envoi du ticket avec les données :", ticketData);

    try {
      const response = await fetch("https://tickevo-backend.vercel.app/tickets", {
        method: "POST", // Envoie une requête POST pour créer un nouveau ticket
        headers: {
          "Content-Type": "application/json", // Indique que les données sont en JSON
          Authorization: `Bearer ${storedToken}`, //  Ajoute le token pour l'authentification
        },
        body: JSON.stringify(ticketData), // Convertit les données en JSON avant l'envoi
      });

      const result = await response.json(); // Convertit la réponse en JSON

      if (!response.ok) {
        console.error("❌ Erreur de soumission :", result);
        throw new Error(
          result.message || "Erreur lors de la création du ticket"
        );
      }

      console.log(" Ticket créé avec succès :", result);
      alert("Ticket créé avec succès !");
      router.push("/home"); // Redirige vers la page d'accueil
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
      {/* Affiche l'en-tête correspondant au rôle de l'utilisateur */}
      {userRole === "Administrateur" ? (
        <HeaderAdministrateur />
      ) : userRole === "Technicien" ? (
        <HeaderTechnicien />
      ) : (
        <HeaderUser />
      )}

      <div className={styles.content}>
        <h2 className={styles.title}>Créer un ticket</h2>

        <div className={styles.card}>
          <h3 className={styles.object}>
            <strong>Objet :</strong> {category} → {ticketType}
            {category === "Incident" && subCategory && `→ ${subCategory} `}
          </h3>

          {/* Champ de texte pour la description */}
          <textarea
            className={styles.textarea}
            placeholder="Expliquez votre demande..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>

          <div className={styles.buttonContainer}>
            {/* Bouton pour annuler et retourner à l'accueil */}
            <button
              className={styles.cancelButton}
              onClick={() => router.push("/home")}
            >
              Annuler
            </button>

            {/* Bouton pour soumettre le ticket */}
            <button className={styles.submitButton} onClick={handleSubmit}>
              Soumettre
            </button>
          </div>
        </div>
      </div>

      <Footer /> {/* Affiche le pied de page */}
    </div>
  );
};

export default NewTicket; // Exporte le composant pour être utilisé ailleurs
