import { useDispatch } from "react-redux";
import { useRouter } from "next/router"; // ✅ Import du router Next.js
import { logout } from "../reducers/authentification";
import styles from '../styles/HeaderUser.module.css';
import { IconHome, IconTicket, IconBell, IconLogout } from '@tabler/icons-react';

function HeaderUser() {
  const dispatch = useDispatch();
  const router = useRouter(); // ✅ Initialisation du router

  const handleLogout = () => {
    dispatch(logout()); // ✅ Déclenche le logout
    router.push('/'); // ✅ Redirige vers la page d’accueil (index.js)
  };

  return (
    <div className={styles.header}>
      <div className={styles.logo}>TickEvo</div>
      <nav className={styles.nav}>
        <button className={styles.button}>
          <IconHome size={25} className={styles.icon} />
        </button>
        <button className={styles.button}>
          <IconTicket size={25} className={styles.icon} />
        </button>
        <button className={styles.button}>
          <IconBell size={25} className={styles.icon} />
        </button>
        <button className={styles.button} onClick={handleLogout}>
          <IconLogout size={25} className={styles.icon} />
        </button>
      </nav>
    </div>
  );
}

export default HeaderUser;

