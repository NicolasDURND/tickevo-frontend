import { useDispatch } from "react-redux";
import { useRouter } from "next/router"; // ✅ Import du router Next.js
import { logout } from "../reducers/authentification";
import styles from "../styles/HeaderUser.module.css";
import {
  IconHome,
  IconTicket,
  IconBell,
  IconLogout,
} from "@tabler/icons-react";

function HeaderUser() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout()); // ✅ Déclenche le logout
    router.replace("/");
  };

  return (
    <div className={styles.header}>
      <div className={styles.logo}>TickEvo</div>
      <nav className={styles.nav}>
        <button title="Accueil" className={styles.button} onClick={() => router.push("/home")}><IconHome size={25} className={styles.icon} /></button>
        <button title="Mes tickets créés" className={styles.button} onClick={() => router.push("/mytickets")}><IconTicket size={25} className={styles.icon} /></button>
        <button title="Notifications" className={styles.button}><IconBell size={25} className={styles.icon} /></button>
        <button title="Déconnexion" className={styles.button} onClick={handleLogout}><IconLogout size={25} className={styles.icon} /></button>
      </nav>
    </div>
  );
}

export default HeaderUser;
