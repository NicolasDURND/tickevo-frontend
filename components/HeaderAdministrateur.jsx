import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router"; // ✅ Hook de navigation Next.js
import { logout } from "../reducers/authentification";
import styles from "../styles/HeaderAdministrateur.module.css";
import { IconHome, IconArchive, IconFiles, IconBell, IconSettings, IconLogout, IconSearch } from "@tabler/icons-react";
import { persistor } from '../store';

function HeaderAdministrateur() {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSearch = () => {
    console.log("Recherche : ", searchTerm);
  };

  const handleLogout = () => {
    dispatch(logout()); // :white_check_mark: Déclenche le logout

    window.location.href = '/'; // :white_check_mark: Redirige vers la page d’accueil (index.js)
  };

  return (
    <div className={styles.header}>
      {/* Logo + Barre de recherche */}
      <div className={styles.logoSearchContainer}>
        <div className={styles.logo}>TickEvo</div>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Rechercher un ticket..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className={styles.searchButton} onClick={handleSearch}>
            <IconSearch size={20} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        <button className={styles.button}><IconHome size={25} className={styles.icon} /></button>
        <button className={styles.button}><IconArchive size={25} className={styles.icon} /></button>
        <button className={styles.button}><IconFiles size={25} className={styles.icon} /></button>
        <button className={styles.button}><IconBell size={25} className={styles.icon} /></button>
        <button className={styles.button} onClick={() => router.push("/admin")}><IconSettings size={25} className={styles.icon} /></button>
        <button className={styles.button} onClick={handleLogout}>
<IconLogout size={25} className={styles.icon} />
        </button>
      </nav>
    </div>
  );
}

export default HeaderAdministrateur;
