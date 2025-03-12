import { useEffect, useState } from "react";
import HeaderUser from "../components/HeaderUser";
import HeaderTechnicien from "../components/HeaderTechnicien";
import HeaderAdministrateur from "../components/HeaderAdministrateur";
import MyTickets from "../components/MyTickets";
import styles from "../styles/MyTickets.module.css";

export default function MyTicketsPage() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role"); // ✅ Récupère le rôle stocké
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);
  
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
        <MyTickets />
      </div>
    </div>
  );
}
