import { useState } from "react";
import styles from "../styles/HeaderAdministrateur.module.css";
import {
  IconHome,
  IconTicket,
  IconBell,
  IconLogout,
  IconSettings,
  IconArchive,
  IconFiles,
  IconSearch,
} from "@tabler/icons-react";

function HeaderTechnicien() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    console.log("Recherche : ", searchTerm); // Remplacez ceci par la logique de recherche réelle
  };

  return (
    <div className={styles.header}>
      {/* Groupe contenant le logo + barre de recherche */}
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

      <nav className={styles.nav}>
        <button className={styles.button}>
          <IconHome size={25} className={styles.icon} />
        </button>
        <button className={styles.button}>
          <IconArchive size={25} className={styles.icon} />
        </button>
        <button className={styles.button}>
          <IconFiles size={25} className={styles.icon} />
        </button>
        <button className={styles.button}>
          <IconBell size={25} className={styles.icon} />
        </button>
        <button className={styles.button}>
          <IconLogout size={25} className={styles.icon} />
        </button>
      </nav>
    </div>
  );
}

export default HeaderTechnicien;
