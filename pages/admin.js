import React, { useState, useEffect } from "react";
import HeaderAdministrateur from "../components/HeaderAdministrateur";
import UserManagement from "../components/UserManagement";
import styles from "../styles/Admin.module.css";
import Footer from "../components/Footer";

export default function Admin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // ✅ Récupérer les utilisateurs depuis le backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Vous devez être connecté pour voir les utilisateurs.");
          return;
        }

        const response = await fetch("http://localhost:3000/users/allusers", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          setUsers(data.users);
        } else {
          console.error("Erreur lors du chargement des utilisateurs:", data.message);
        }
      } catch (error) {
        console.error("Erreur serveur:", error);
      }
    };

    fetchUsers();
  }, []);

// ✅ Calculer et trier les utilisateurs à afficher
const indexOfLastUser = currentPage * usersPerPage;
const indexOfFirstUser = indexOfLastUser - usersPerPage;
const currentUsers = users
  .slice()
  .sort((a, b) => a.username.localeCompare(b.username)) // 🔥 Trie par username A-Z
  .slice(indexOfFirstUser, indexOfLastUser);

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
                {currentUsers
                  .filter((user) =>
                    user.username.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((user, index) => (
                    <tr key={index}>
                      <td>{user.username}</td>
                      <td>{user.roleId?.roleName || "N/A"}</td>
                      <td>{user.serviceId?.serviceName || "N/A"}</td>
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
              <span>
                Page {currentPage} / {Math.ceil(users.length / usersPerPage)}
              </span>
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
        <Footer />
      </div>
    </>
  );
}
