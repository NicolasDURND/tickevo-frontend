import { useState } from "react"; // Gère l'état local (ici pour la barre de recherche)
import { useDispatch } from "react-redux"; // Permet d'envoyer des actions Redux
import { useRouter } from "next/router"; // Hook de navigation Next.js
import { logout } from "../reducers/authentification"; // Action Redux pour la déconnexion
import styles from "../styles/Headertechnicien.module.css"; // Importe les styles CSS du header
import { 
  IconHome, IconArchive, IconFiles, 
  IconBell, IconTicket, IconLogout, IconSearch 
} from "@tabler/icons-react"; // Importe les icônes depuis Tabler

function HeaderTechnicien() {
  const [searchTerm, setSearchTerm] = useState(""); // État pour stocker la recherche
  const dispatch = useDispatch(); // Permet d'envoyer des actions Redux
  const router = useRouter(); // Hook de navigation Next.js

  // Fonction exécutée lors d'une recherche
  const handleSearch = () => {
    console.log("Recherche : ", searchTerm);
  };

  // Déconnecte l'utilisateur et le redirige à l'accueil
  const handleLogout = () => {
    dispatch(logout()); // Envoie l'action de déconnexion
    router.replace("/"); // Redirige vers la page d'accueil
  };

  return (
    <div className={styles.header}> {/* Conteneur principal du header */}
      
      {/* Logo + Barre de recherche */}
      <div className={styles.logoSearchContainer}>
        <div className={styles.logo}>TickEvo</div> {/* Nom de l'application */}

        {/* Barre de recherche */}
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Rechercher un ticket..." // Texte affiché avant la saisie
            className={styles.searchInput} // Style de l'input
            value={searchTerm} // Associe l'état à la valeur du champ
            onChange={(e) => setSearchTerm(e.target.value)} // Met à jour l'état à chaque saisie
          />
          <button className={styles.searchButton} onClick={handleSearch}> {/* Bouton de recherche */}
            <IconSearch size={20} />
          </button>
        </div>
      </div>

      {/* Navigation principale */}
      <nav className={styles.nav}>
        {/* Accueil */}
        <button title="Accueil" className={styles.button} onClick={() => router.push("/home")}>
          <IconHome size={25} className={styles.icon} />
        </button>

        {/* Tous les tickets à traiter */}
        <button title="Tous les tickets à traiter" className={styles.button} onClick={() => router.push("/allTicketsList")}>
          <IconArchive size={25} className={styles.icon} />
        </button>

        {/* Mes tickets à traiter */}
        <button title="Mes tickets à traiter" className={styles.button} onClick={() => router.push("/personalTicketsList")}>
          <IconFiles size={25} className={styles.icon} />
        </button>

        {/* Notifications */}
        <button title="Notifications" className={styles.button}>
          <IconBell size={25} className={styles.icon} />
        </button>

        {/* Mes tickets créés */}
        <button title="Mes tickets créés" className={styles.button} onClick={() => router.push("/mytickets")}>
          <IconTicket size={25} className={styles.icon} />
        </button>

        {/* Déconnexion */}
        <button title="Déconnexion" className={styles.button} onClick={handleLogout}>
          <IconLogout size={25} className={styles.icon} />
        </button>
      </nav>
    </div>
  );
}

export default HeaderTechnicien; // Exporte le composant pour l'utiliser ailleurs
