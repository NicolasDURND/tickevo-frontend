import { useState, useEffect } from "react"; // Importe useState et useEffect pour gérer l'état et les effets
import styles from "../styles/Footer.module.css"; // Importe les styles CSS du footer

function Footer() {
  const [dateTime, setDateTime] = useState(new Date()); // Stocke la date et l'heure actuelles

  useEffect(() => {
    // Met à jour la date et l'heure toutes les secondes
    const interval = setInterval(() => {
      setDateTime(new Date()); // Met à jour l'état avec la nouvelle date
    }, 1000);

    return () => clearInterval(interval); // Supprime l'intervalle quand le composant est démonté
  }, []);

  // Formate la date en français (ex: "lundi 18 mars 2024")
  const formattedDate = dateTime.toLocaleDateString("fr-FR", {
    weekday: "long", // Jour de la semaine en toutes lettres
    day: "numeric", // Numéro du jour
    month: "long", // Mois en toutes lettres
    year: "numeric", // Année complète
  });

  // Formate l'heure (ex: "14:35:45")
  const formattedTime = dateTime.toLocaleTimeString("fr-FR", {
    hour: "2-digit", // Heure sur 2 chiffres
    minute: "2-digit", // Minutes sur 2 chiffres
    second: "2-digit", // Secondes sur 2 chiffres
  });

  return (
    <footer className={styles.footer}> {/* Conteneur du footer */}
      <p>&copy; {new Date().getFullYear()} - TickEvo. Tous droits réservés.</p> {/* Affiche l'année actuelle */}
      <p className={styles.dateTime}>{formattedDate} - {formattedTime}</p> {/* Affiche la date et l'heure mises à jour */}
    </footer>
  );
}

export default Footer; // Exporte le composant pour l'utiliser ailleurs
