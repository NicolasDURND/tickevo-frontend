import React, { useState } from "react"; // Gère l'état local pour les inputs utilisateur
import { useDispatch, useSelector } from "react-redux"; // Permet de gérer l'état global avec Redux
import { useRouter } from "next/router"; // Importe le hook de navigation Next.js
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../reducers/authentification"; // Actions Redux pour gérer la connexion
import styles from "../styles/Login.module.css"; // Importe les styles CSS

const Login = () => {
  const dispatch = useDispatch(); // Permet d'envoyer des actions Redux
  const router = useRouter(); // Permet la navigation entre les pages
  const { loading, error } = useSelector((state) => state.auth); // Récupère l'état de l'authentification depuis Redux

  const [username, setUsername] = useState(""); // Stocke le nom d'utilisateur
  const [password, setPassword] = useState(""); // Stocke le mot de passe

  // Gère la connexion de l'utilisateur
  const handleLogin = async () => {
    dispatch(loginStart()); // Indique que la connexion est en cours

    try {
      const response = await fetch("https://tickevo-backend.vercel.app/users/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }), // Envoie les identifiants au serveur
      });

      const data = await response.json(); // Récupère la réponse du backend

      if (!response.ok) {
        throw new Error(data.error); // Affiche le message d'erreur renvoyé par le serveur
      }

      // Stocke les informations utilisateur dans le localStorage
      localStorage.setItem("token", data.user.token);
      localStorage.setItem("role", data.user.roleId);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Met à jour Redux avec les infos de l'utilisateur
      dispatch(loginSuccess({ user: data.user, token: data.user.token }));

      // Redirige l'utilisateur selon son rôle
      if (
        data.user.roleId === "Administrateur" ||
        data.user.roleId === "Technicien"
      ) {
        router.push("/allTicketsList"); // Redirection vers la liste des tickets
      } else {
        router.push("/home"); // Redirection vers la page d'accueil
      }
    } catch (error) {
      dispatch(loginFailure(error.message)); // Affiche le message d'erreur dans Redux
    }
  };

  return (
    <div className={styles.container}> {/* Conteneur principal du formulaire */}
      <div className={styles.input}> {/* Conteneur des champs de saisie */}

        {/* Logo de l'application */}
        <div className={styles.logo}>
          <img src="/LogoV2.jpg" alt="logo" width={250} height={200} />
        </div>

        {/* Champ de saisie du nom d'utilisateur */}
        <input
          className={styles.username}
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />

        {/* Champ de saisie du mot de passe */}
        <input
          className={styles.password}
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />

        {/* Bouton de connexion */}
        <button
          className={styles.loginButton}
          onClick={handleLogin}
          disabled={loading} // Désactive le bouton en cas de chargement
        >
          {loading ? "Connexion en cours..." : "Connexion"}
        </button>

        {/* Message d'erreur en cas de problème */}
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

export default Login; // Exporte le composant pour l'utiliser ailleurs
