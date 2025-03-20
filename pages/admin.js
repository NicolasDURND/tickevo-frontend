import React, { useState, useEffect } from "react"; // Import React et ses hooks useState et useEffect
import HeaderAdministrateur from "../components/HeaderAdministrateur"; // Import du composant d'en-tête pour l'administrateur
import UserManagement from "../components/UserManagement"; // Import du composant de gestion des utilisateurs
import styles from "../styles/Admin.module.css"; // Import du fichier CSS spécifique à la page admin
import Footer from "../components/Footer"; // Import du pied de page

export default function Admin() {
  const [searchTerm, setSearchTerm] = useState(""); // Stocke le texte de recherche pour filtrer les utilisateurs
  const [users, setUsers] = useState([]); // Stocke la liste des utilisateurs récupérés du backend
  const [selectedUser, setSelectedUser] = useState(null); // Stocke l'utilisateur sélectionné pour voir ses détails
  const [currentPage, setCurrentPage] = useState(1); // Stocke le numéro de la page actuelle pour la pagination
  const usersPerPage = 10; // Définit le nombre d'utilisateurs affichés par page

  // ✅ Récupérer les utilisateurs depuis le backend lors du chargement du composant
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token"); // Récupère le token de l'utilisateur connecté
        if (!token) {
          alert("Vous devez être connecté pour voir les utilisateurs.");
          return;
        }

        const response = await fetch("https://tickevo-backend.vercel.app/users/allusers", {
          method: "GET", // Requête GET pour récupérer les utilisateurs
          headers: {
            "Content-Type": "application/json", // Indique que les données sont au format JSON
            Authorization: `Bearer ${token}`, // Ajoute le token pour l'authentification
          },
        });

        const data = await response.json(); // Convertit la réponse en JSON
        if (data.success) {
          setUsers(data.users); // Stocke les utilisateurs dans l'état
        } else {
          console.error("Erreur lors du chargement des utilisateurs:", data.message);
        }
      } catch (error) {
        console.error("Erreur serveur:", error);
      }
    };

    fetchUsers(); // Appelle la fonction pour récupérer les utilisateurs
  }, []);

  // ✅ Calculer et trier les utilisateurs à afficher
  const indexOfLastUser = currentPage * usersPerPage; // Calcul de l'index du dernier utilisateur affiché
  const indexOfFirstUser = indexOfLastUser - usersPerPage; // Calcul de l'index du premier utilisateur affiché
  const currentUsers = users
    .slice() // Crée une copie du tableau pour éviter de modifier l'original
    .sort((a, b) => a.username.localeCompare(b.username)) // 🔥 Trie les utilisateurs par username (ordre alphabétique)
    .slice(indexOfFirstUser, indexOfLastUser); // Sélectionne uniquement les utilisateurs à afficher sur la page actuelle

  // ✅ Changer de page (passer à la page suivante)
  const nextPage = () => {
    if (currentPage < Math.ceil(users.length / usersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // ✅ Revenir à la page précédente
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // ✅ Gérer le clic sur le bouton "Voir détails"
  const handleDetailClick = (user) => {
    setSelectedUser(user); // Définit l'utilisateur sélectionné
  };

  return (
    <>
      <HeaderAdministrateur /> {/* Affiche l'en-tête pour l'administrateur */}
      <div className={styles.pageContainer}>
        <div className={styles.container}>
          
          {/* ✅ Barre de recherche pour filtrer les utilisateurs */}
          <div className={styles.card}>
            <h2>Rechercher un utilisateur</h2>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Rechercher un utilisateur..." // Placeholder pour indiquer la recherche
                className={styles.searchInput}
                value={searchTerm} // Stocke la valeur actuelle de la recherche
                onChange={(e) => setSearchTerm(e.target.value)} // Met à jour l'état à chaque frappe de l'utilisateur
              />
            </div>

            {/* ✅ Tableau affichant les utilisateurs */}
            <table className={styles.userTable}>
              <thead>
                <tr>
                  <th>Nom d'utilisateur</th>
                  <th>Rôle</th>
                  <th>Service</th>
                  <th></th> {/* Colonne vide pour le bouton "Voir détails" */}
                </tr>
              </thead>
              <tbody>
                {currentUsers
                  .filter((user) =>
                    user.username.toLowerCase().includes(searchTerm.toLowerCase()) // 🔍 Filtre par nom d'utilisateur
                  )
                  .map((user, index) => (
                    <tr key={index}>
                      <td>{user.username}</td> {/* Affiche le nom d'utilisateur */}
                      <td>{user.roleId?.roleName || "N/A"}</td> {/* Affiche le rôle de l'utilisateur */}
                      <td>{user.serviceId?.serviceName || "N/A"}</td> {/* Affiche le service de l'utilisateur */}
                      <td>
                        <button
                          className={styles.detailButton}
                          onClick={() => handleDetailClick(user)} // Ouvre les détails de l'utilisateur sélectionné
                        >
                          Voir détails
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {/* ✅ Boutons de pagination */}
            <div className={styles.pagination}>
              <button
                onClick={prevPage} // Passe à la page précédente
                disabled={currentPage === 1} // Désactive si on est déjà sur la première page
                className={styles.pageButton}
              >
                Précédent
              </button>
              <span>
                Page {currentPage} / {Math.ceil(users.length / usersPerPage)} {/* Affiche le numéro de la page actuelle */}
              </span>
              <button
                onClick={nextPage} // Passe à la page suivante
                disabled={currentPage === Math.ceil(users.length / usersPerPage)} // Désactive si on est à la dernière page
                className={styles.pageButton}
              >
                Suivant
              </button>
            </div>
          </div>

          {/* ✅ Gestion des utilisateurs (affichage des détails) */}
          <UserManagement selectedUser={selectedUser} />

        </div>
        <Footer /> {/* Affiche le pied de page */}
      </div>
    </>
  );
}
