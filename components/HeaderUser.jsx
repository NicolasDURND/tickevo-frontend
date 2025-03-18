import { useDispatch } from "react-redux"; // Permet d'envoyer des actions Redux
import { useRouter } from "next/router"; // Gestion de la navigation avec Next.js
import { logout } from "../reducers/authentification"; // Action Redux pour la déconnexion
import styles from "../styles/HeaderUser.module.css"; // Importe les styles CSS du header
import {
  IconHome,
  IconTicket,
  IconBell,
  IconLogout,
} from "@tabler/icons-react"; // Importe les icônes depuis Tabler

function HeaderUser() {
  const dispatch = useDispatch(); // Permet d'envoyer des actions Redux
  const router = useRouter(); // Hook de navigation Next.js

  // Déconnecte l'utilisateur et le redirige à l'accueil
  const handleLogout = () => {
    dispatch(logout()); // Envoie l'action de déconnexion
    router.replace("/"); // Redirige vers la page d'accueil
  };

  return (
    <div className={styles.header}> {/* Conteneur principal du header */}
      <div className={styles.logo}>TickEvo</div> {/* Nom de l'application */}

      {/* Navigation principale */}
      <nav className={styles.nav}>
        {/* Accueil */}
        <button title="Accueil" className={styles.button} onClick={() => router.push("/home")}>
          <IconHome size={25} className={styles.icon} />
        </button>

        {/* Mes tickets créés */}
        <button title="Mes tickets créés" className={styles.button} onClick={() => router.push("/mytickets")}>
          <IconTicket size={25} className={styles.icon} />
        </button>

        {/* Notifications */}
        <button title="Notifications" className={styles.button}>
          <IconBell size={25} className={styles.icon} />
        </button>

        {/* Déconnexion */}
        <button title="Déconnexion" className={styles.button} onClick={handleLogout}>
          <IconLogout size={25} className={styles.icon} />
        </button>
      </nav>
    </div>
  );
}

export default HeaderUser; // Exporte le composant pour l'utiliser ailleurs
