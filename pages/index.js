import React from "react";
import Login from "../components/Login";
import styles from "../styles/Login.module.css"; // Import des styles

export default function Index() {
  return (
    <div className={styles.main}>
      <Login />
      <div className={styles.container}>
      </div>
    </div>
  );
}
