import React, { useState } from "react";
import styles from "../styles/Admin.module.css";

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("modify");

  return (
    <div className={styles.card}>
      {/* ✅ Onglets pour basculer entre Modification et Création */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "modify" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("modify")}
        >
          Modifier
        </button>
        <button
          className={`${styles.tab} ${activeTab === "create" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("create")}
        >
          Créer
        </button>
      </div>

      {/* ✅ Affichage de la section sélectionnée */}
      {activeTab === "modify" ? (
        <div className={styles.modifierBox}>
          <h2>Modifier un utilisateur</h2>
          <input type="text" placeholder="Nom Utilisateur" />
          <input type="password" placeholder="Mot de passe" />
          <input type="text" placeholder="Rôle" />
          <input type="text" placeholder="Groupe" />
          <button className={styles.button}>Modifier</button>
        </div>
      ) : (
        <div className={styles.createBox}>
          <h2>Créer un utilisateur</h2>
          <input type="text" placeholder="Nom Utilisateur" />
          <input type="password" placeholder="Mot de passe" />
          <input type="text" placeholder="Rôle" />
          <input type="text" placeholder="Groupe" />
          <button className={styles.button}>Créer</button>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
