import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../reducers/authentification";
import styles from "../styles/Login.module.css";

const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    dispatch(loginStart());
  
    try {
      const response = await fetch("http://localhost:3000/users/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json(); // ✅ Récupère la réponse JSON
  
      if (!response.ok) {
        throw new Error(data.error); // ✅ Affiche exactement le message du backend
      }
  
      localStorage.setItem("token", data.user.token);
      localStorage.setItem("role", data.user.roleId);
      localStorage.setItem("user", JSON.stringify(data.user));
  
      dispatch(loginSuccess({ user: data.user, token: data.user.token }));
      router.push("/home");
    } catch (error) {
      dispatch(loginFailure(error.message)); // ✅ Affiche le message du backend
    }
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <img src="/LogoV2.jpg" alt="logo" width={250} height={200} />
      </div>

      <div className={styles.input}>
        <input
          className={styles.username}
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <input
          className={styles.password}
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button
          className={styles.loginButton}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Connexion en cours..." : "Connexion"}
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

export default Login;
