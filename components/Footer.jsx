import { useState, useEffect } from "react";
import styles from "../styles/Footer.module.css";

function Footer() {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval); // ✅ Nettoie l'intervalle quand le composant se démonte
  }, []);

  const formattedDate = dateTime.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = dateTime.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <footer className={styles.footer}>
      <p>&copy; {new Date().getFullYear()} - TickEvo. Tous droits réservés.</p>
      <p className={styles.dateTime}>{formattedDate} - {formattedTime}</p>
    </footer>
  );
}

export default Footer;
