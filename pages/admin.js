import React, { useState } from "react";
import HeaderAdministrateur from "../components/HeaderAdministrateur";
import styles from "../styles/Admin.module.css";
import { IconSearch } from "@tabler/icons-react";

export default function Admin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([
    { username: "User1", role: "Demandeur", group: "-" },
    { username: "Admin1", role: "Administrateur", group: "Groupe 1" },
  ]);

  return (
    <>
      <HeaderAdministrateur />

      <div className={styles.pageContainer}>
        {/* ✅ Section avec Recherche et Modification alignées côte à côte */}
        <div className={styles.container}>
          {/* ✅ Recherche */}
          <div className={styles.card}>
            <h2>Rechercher un utilisateur</h2>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className={styles.searchButton}>
                <IconSearch size={20} />
              </button>
            </div>

            {/* ✅ Tableau des utilisateurs */}
            <table className={styles.userTable}>
              <thead>
                <tr>
                  <th>Nom d'utilisateur</th>
                  <th>Rôle</th>
                  <th>Groupe</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td>{user.username}</td>
                    <td>{user.role}</td>
                    <td>{user.group || "-"}</td>
                    <td>
                      <button className={styles.detailButton}>Détail</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ✅ Modification */}
          <div className={styles.card}>
            <h2>Modifier (reprendre le nom de l'utilisateur recherché)</h2>
            <div className={styles.modifierBox}>
              <input type="text" placeholder="Nom Utilisateur" />
              <input type="password" placeholder="Mot de passe" />
              <input type="text" placeholder="Rôle" />
              <input type="text" placeholder="Groupe" />
              <button className={styles.button}>Modifier</button>
            </div>
          </div>
        </div>

        {/* ✅ Création en dessous et centrée */}
        <div className={styles.createContainer}>
          <div className={styles.card}>
            <h2>Créer un utilisateur</h2>
            <div className={styles.createBox}>
              <input type="text" placeholder="Nom Utilisateur" />
              <input type="password" placeholder="Mot de passe" />
              <input type="text" placeholder="Rôle" />
              <input type="text" placeholder="Groupe" />
              <button className={styles.button}>Créer</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
