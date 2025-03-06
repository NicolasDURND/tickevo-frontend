import React, { useState } from "react";
import HeaderAdministrateur from "../components/HeaderAdministrateur";
import UserManagement from "../components/UserManagement"; // ✅ Import du composant
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

          {/* ✅ Gestion des utilisateurs (Modifier / Créer) */}
          <UserManagement />
        </div>
      </div>
    </>
  );
}
