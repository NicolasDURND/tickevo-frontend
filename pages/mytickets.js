import { useEffect, useState } from "react"; // Import des hooks useEffect et useState pour gérer les effets et l'état
import HeaderUser from "../components/HeaderUser"; // Import du header pour les utilisateurs standards
import HeaderTechnicien from "../components/HeaderTechnicien"; // Import du header pour les techniciens
import HeaderAdministrateur from "../components/HeaderAdministrateur"; // Import du header pour les administrateurs
import MyTickets from "../components/MyTickets"; // Import du composant affichant les tickets de l'utilisateur
import styles from "../styles/MyTickets.module.css"; // Import du fichier CSS spécifique à la page des tickets

// ✅ Composant principal représentant la page des tickets de l'utilisateur
export default function MyTicketsPage() {
  const [userRole, setUserRole] = useState(null); // Stocke le rôle de l'utilisateur connecté

  useEffect(() => {
    // ✅ Récupère le rôle de l'utilisateur stocké dans localStorage
    const storedRole = localStorage.getItem("role"); 
    if (storedRole) {
      setUserRole(storedRole); // Met à jour l'état avec le rôle récupéré
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

      {/* ✅ Contenu principal de la page affichant les tickets */}
      <div className={styles.container}>
        <MyTickets /> {/* Affiche le composant qui liste les tickets de l'utilisateur */}
      </div>
    </div>
  );
}
