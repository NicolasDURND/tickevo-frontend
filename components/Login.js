import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router"; // Import Next.js router
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../reducers/authentification";
import styles from "../styles/Login.module.css";

const Login = () => {
  const dispatch = useDispatch(); // Initialize Redux dispatch
  const router = useRouter(); // Initialize Next.js router
  const { loading, error } = useSelector((state) => state.auth); // Get loading & error state from Redux

  const [username, setUsername] = useState(""); // Username state
  const [password, setPassword] = useState(""); // Password state

  const handleLogin = async () => {
    dispatch(loginStart()); // Dispatch action to start login (loading = true)
    try {
      const response = await fetch("http://localhost:3000/users/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }), // Send credentials
      });

      if (!response.ok) {
        throw new Error("Nom d'utilisateur ou mot de passe incorrect"); // Handle error if bad credentials
      }

      const data = await response.json();

      // ✅ Save user & token in localStorage
      localStorage.setItem("token", data.token); // Save token in localStorage
      localStorage.setItem("user", JSON.stringify(data.user)); // Save user object in localStorage

      dispatch(loginSuccess(data)); // Save user & token in Redux store

      // ✅ Redirect to home page
      router.push("/home");
    } catch (error) {
      dispatch(loginFailure(error.message)); // Dispatch failure action with error message
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <img src="/LogoV2.jpg" alt="logo" width={250} height={200} />{" "}
        {/* Logo */}
      </div>

      <div className={styles.input}>
        <input
          className={styles.username}
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)} // Update username state
        />
        <br />
        <input
          className={styles.password}
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state
        />
        <br />
        <button
          className={styles.loginButton}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Connexion en cours..." : "Connexion"}{" "}
          {/* Button with dynamic label */}
        </button>
        {error && <p className={styles.error}>{error}</p>}{" "}
        {/* Show error message if exists */}
      </div>
    </div>
  );
};

export default Login; // Export the component
