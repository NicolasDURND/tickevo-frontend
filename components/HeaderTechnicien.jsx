import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router"; // ✅ Hook Next.js pour la redirection
import { logout } from "../reducers/authentification"; // ✅ À adapter selon ton arborescence
import styles from "../styles/Headertechnicien.module.css";
import { IconHome,  IconArchive,  IconFiles,  IconBell,  IconLogout,  IconSearch, } from "@tabler/icons-react";

function HeaderTechnicien() {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSearch = () => {
    console.log("Recherche : ", searchTerm);
  };

  const handleLogout = () => {
    dispatch(logout()); // :white_check_mark: Déclenche le logout
    router.replace("/");
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
        <button className={styles.button} onClick={() => router.push("/ViewTickets")}><IconArchive size={25} className={styles.icon} /></button>
        <button className={styles.button}><IconFiles size={25} className={styles.icon} /></button>
        <button className={styles.button}><IconBell size={25} className={styles.icon} /></button>
        <button className={styles.button} onClick={handleLogout}><IconLogout size={25} className={styles.icon} /></button>
      </nav>
    </div>
  );
}

export default HeaderTechnicien;
