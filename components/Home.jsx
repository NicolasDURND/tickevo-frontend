import HeaderTechnicien from "./HeaderTechnicien"; // Importe le header spécifique aux techniciens
import styles from "../styles/Home.module.css"; // Importe les styles CSS pour la page d'accueil

function Home() {
  return (
    <div> {/* Conteneur principal */}
      <HeaderTechnicien /> {/* Affiche le header des techniciens */}
      
      <main className={styles.main}> {/* Contenu principal */}
        <h1 className={styles.title}>Welcome to Tickevo !</h1> {/* Titre de la page */}
        <Login /> {/* Composant de connexion (à s'assurer qu'il est bien importé) */}
      </main>
    </div>
  );
}

export default Home; // Exporte le composant pour être utilisé ailleurs
