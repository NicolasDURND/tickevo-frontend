import { useEffect, useState } from "react"; // Import des hooks useEffect et useState pour gérer l'état et les effets
import HeaderUser from "../components/HeaderUser"; // Import du header pour les utilisateurs standards
import HeaderTechnicien from "../components/HeaderTechnicien"; // Import du header pour les techniciens
import HeaderAdministrateur from "../components/HeaderAdministrateur"; // Import du header pour les administrateurs
import DemandeTickets from "../components/DemandeTickets"; // Import du composant affichant les demandes de tickets
import LastTickets from "../components/LastTickets"; // Import du composant affichant les derniers tickets
import styles from "../styles/Home.module.css"; // Import du fichier CSS spécifique à la page d'accueil
import Footer from "../components/Footer"; // Import du pied de page

// ✅ Composant principal représentant la page d'accueil
export default function Home() {
  const [userRole, setUserRole] = useState(null); // Stocke le rôle de l'utilisateur connecté

  useEffect(() => {
    // ✅ Récupère le rôle de l'utilisateur stocké dans le localStorage
    const storedRole = localStorage.getItem("role"); 
    if (storedRole) {
      setUserRole(storedRole); // Met à jour l'état avec le rôle
    }
  }, []); // Exécuté une seule fois au montage du composant

  return (
    <div className={styles.main}>
      {/* ✅ Affichage dynamique du bon Header selon le rôle de l'utilisateur */}
      {userRole === "Administrateur" ? (
        <HeaderAdministrateur />
      ) : userRole === "Technicien" ? (
        <HeaderTechnicien />
      ) : (
        <HeaderUser />
      )}

      {/* ✅ Contenu principal de la page d'accueil */}
      <div className={styles.container}>
        <DemandeTickets /> {/* Affiche la section des demandes de tickets */}
        <LastTickets /> {/* Affiche la section des derniers tickets */}
      </div>

      <Footer /> {/* Affiche le pied de page */}
    </div>
  );
}
