import { useEffect, useState } from "react";
import HeaderUser from "../components/HeaderUser";
import HeaderTechnicien from "../components/HeaderTechnicien";
import HeaderAdministrateur from "../components/HeaderAdministrateur";
import DemandeTickets from "../components/DemandeTickets";
import LastTickets from "../components/LastTickets";
import styles from "../styles/Home.module.css";
import Footer from "../components/Footer";

export default function Home() {
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
        <DemandeTickets />
        <LastTickets />
      </div>
        <Footer />
    </div>
  );
}
