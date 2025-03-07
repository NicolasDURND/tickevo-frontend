import React, { useState } from "react";
import HeaderAdministrateur from "../components/HeaderAdministrateur";
import UserManagement from "../components/UserManagement";
import styles from "../styles/Admin.module.css";
import { IconSearch } from "@tabler/icons-react";

export default function Admin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([
    { username: "Admin1", role: "Administrateur", group: "" },
    { username: "Technicien1", role: "Technicien", group: "Groupe 1" },
    { username: "User1", role: "Demandeur", group: "" },
    { username: "User2", role: "Demandeur", group: "" },
    { username: "User3", role: "Demandeur", group: "" },
    { username: "User4", role: "Demandeur", group: "" },
    { username: "User5", role: "Demandeur", group: "" },
    { username: "User6", role: "Demandeur", group: "" },
    { username: "User7", role: "Demandeur", group: "" },
    { username: "User8", role: "Demandeur", group: "" },
    { username: "User9", role: "Demandeur", group: "" },
    { username: "User10", role: "Demandeur", group: "" },
    { username: "User11", role: "Demandeur", group: "" },
    { username: "User12", role: "Demandeur", group: "" },
  ]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10; // ✅ Afficher 10 utilisateurs par page

  // ✅ Calculer les utilisateurs à afficher
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // ✅ Changer de page
  const nextPage = () => {
    if (currentPage < Math.ceil(users.length / usersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleDetailClick = (user) => {
    setSelectedUser(user);
  };

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
                  <th>Service</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
                  <tr key={index}>
                    <td>{user.username}</td>
                    <td>{user.role}</td>
                    <td>{user.group || "-"}</td>
                    <td>
                      <button
                        className={styles.detailButton}
                        onClick={() => handleDetailClick(user)}
                      >
                        Détail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ✅ Boutons de pagination */}
            <div className={styles.pagination}>
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={styles.pageButton}
              >
                Précédent
              </button>
              <span> Page {currentPage} / {Math.ceil(users.length / usersPerPage)} </span>
              <button
                onClick={nextPage}
                disabled={currentPage === Math.ceil(users.length / usersPerPage)}
                className={styles.pageButton}
              >
                Suivant
              </button>
            </div>
          </div>

          {/* ✅ Gestion des utilisateurs */}
          <UserManagement selectedUser={selectedUser} />
        </div>
      </div>
    </>
  );
}
