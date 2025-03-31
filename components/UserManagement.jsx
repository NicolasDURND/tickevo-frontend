import React, { useState, useEffect } from "react";
import styles from "../styles/Admin.module.css";

const UserManagement = ({ selectedUser }) => {
  // Déclare le composant et récupère l’utilisateur sélectionné en PROPS (de admin.js)

  const [activeTab, setActiveTab] = useState("modify"); // --> UseState Local
  // Onglet actif, soit "modify" (par défaut), soit "create"

  const [roles, setRoles] = useState([]); // --> UseState Local
  // Stocke la liste des rôles récupérés avec le fetch

  const [services, setServices] = useState([]); // --> UseState Local
  // Stocke la liste des services récupérés avec le fetch

  const [modifyFormData, setModifyFormData] = useState({
    username: "",
    password: "",
    roleId: "",
    serviceId: "",
  }); // --> UseState Local
  // Stocke les données saisies dans le formulaire de modification d’un utilisateur

  const [createFormData, setCreateFormData] = useState({
    username: "",
    email: "",
    password: "",
    roleId: "",
    serviceId: "",
  }); // --> UseState Local
  // Stocke les données saisies dans le formulaire de création d’un nouvel utilisateur

// -----------------------------
// Fetch GET des rôles et services au montage du composant
// -----------------------------
useEffect(() => {
  // useEffect avec un tableau de dépendances vide → s’exécute une seule fois au montage du composant

  const fetchRolesAndServices = async () => {
    // Fonction asynchrone pour récupérer les rôles et services depuis le backend

    try {
      const token = localStorage.getItem("token");
      // Récupère le token stocké localement après la connexion de l'utilisateur

      if (!token) {
        alert("Vous devez être connecté pour voir les rôles et services.");
        // Si aucun token trouvé → on alerte l'utilisateur et on arrête l’exécution
        return;
      }

      // Envoie deux requêtes en parallèle pour récupérer les rôles et services
      const [rolesResponse, servicesResponse] = await Promise.all([
        fetch("https://tickevo-backend.vercel.app/users/roles", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            // On passe le token dans l’en-tête Authorization (authentification)
          },
        }),
        fetch("https://tickevo-backend.vercel.app/users/services", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Idem pour la deuxième requête (services)
          },
        }),
      ]);

      const rolesData = await rolesResponse.json();
      const servicesData = await servicesResponse.json();
      // Conversion des réponses JSON pour pouvoir accéder aux données

      if (rolesResponse.ok) {
        setRoles(rolesData.roles);
        // Si la réponse est OK, on met à jour l’état avec la liste des rôles
      } else {
        console.error("Erreur lors du chargement des rôles:", rolesData.error);
        // Sinon, on affiche l’erreur dans la console
      }

      if (servicesResponse.ok) {
        setServices(servicesData.services);
        // Si la réponse est OK, on met à jour l’état avec la liste des services
      } else {
        console.error("Erreur lors du chargement des services:", servicesData.error);
        // Sinon, on affiche l’erreur dans la console
      }
    } catch (error) {
      console.error("Erreur serveur:", error); // Gestion des erreurs réseau ou inattendues
    }
  };

  fetchRolesAndServices(); // Appel de la fonction asynchrone au montage du composant
}, []);

// -----------------------------
// Met à jour le formulaire de modification quand selectedUser change
// -----------------------------
useEffect(() => {
  if (selectedUser) {
    setActiveTab("modify");
    // Active automatiquement l'onglet "Modifier" quand un utilisateur est sélectionné

    setModifyFormData({
      username: selectedUser.username || "",
      // Pré-remplit le champ username avec la donnée de l'utilisateur ou vide

      password: "",
      // Le champ mot de passe est toujours vide par défaut pour des raisons de sécurité

      roleId: selectedUser.roleId?._id || selectedUser.roleId || "",
      // Gère le cas où roleId peut être un objet ou un simple ID

      serviceId: selectedUser.serviceId?._id || selectedUser.serviceId || "",
      // Idem pour le service, prend l'ID directement ou via l'objet complet
    });
  }
}, [selectedUser]);
// Ce useEffect s'exécute uniquement quand selectedUser change

// -----------------------------
// Gère les changements dans les champs du formulaire de modification
// -----------------------------
const handleModifyChange = (e) => {
  let { name, value } = e.target;
  // Récupère le nom et la valeur du champ modifié

  if (name === "serviceId" && value === "") {
    value = null;
    // Si aucun service n'est sélectionné, on stocke null au lieu d'une chaîne vide
  }

  setModifyFormData({ ...modifyFormData, [name]: value });
  // Met à jour le champ correspondant dans le state modifyFormData
};

const handleCreateChange = (e) => {
  const { name, value } = e.target;
  // Récupère le nom et la valeur du champ modifié

  setCreateFormData({ ...createFormData, [name]: value });
  // Met à jour le champ correspondant dans le state createFormData
};

// -----------------------------
// Gère la soumission du formulaire de création
// -----------------------------
const handleCreateSubmit = async (e) => {
  e.preventDefault();
  // Empêche le rechargement par défaut du formulaire

  const token = localStorage.getItem("token");
  // Récupère le token depuis le localStorage

  if (!token) {
    alert("Vous devez être connecté pour créer un utilisateur.");
    return;
    // Si pas de token → l'utilisateur n'est pas authentifié
  }

  try {
    const response = await fetch("https://tickevo-backend.vercel.app/users/signupAdmin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        // En-têtes nécessaires pour une requête sécurisée avec authentification
      },
      body: JSON.stringify(createFormData),
      // Envoie les données du formulaire de création sous forme JSON
    });

    const data = await response.json();
    // Récupère la réponse JSON

    if (response.ok) {
      alert("Utilisateur créé avec succès !");
      window.location.reload();
      // Recharge la page pour mettre à jour la liste ou réinitialiser les formulaires
    } else {
      alert(data.error || "Erreur lors de la création de l'utilisateur.");
      // Affiche une erreur si la création échoue
    }
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
    alert("Erreur serveur");
    // Gestion des erreurs réseau ou serveur
  }
};

// -----------------------------
// Gère la soumission du formulaire de modification
// -----------------------------
const handleModifySubmit = async (e) => {
  e.preventDefault();
  // Empêche le rechargement automatique du formulaire

  if (!selectedUser) {
    alert("Aucun utilisateur sélectionné.");
    return;
    // Ne rien faire si aucun utilisateur n'est en cours de modification
  }

  try {
    const token = localStorage.getItem("token");
    // Récupère le token d'authentification

    if (!token) {
      alert("Vous devez être connecté pour modifier un utilisateur.");
      return;
    }

    const response = await fetch(
      `https://tickevo-backend.vercel.app/users/update/${selectedUser._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          // En-têtes HTTP pour la mise à jour sécurisée
        },
        body: JSON.stringify(modifyFormData),
        // Envoie les données modifiées du formulaire
      }
    );

    const data = await response.json();
    // Récupère la réponse JSON du backend

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur lors de la mise à jour de l'utilisateur"
      );
      // Déclenche une erreur personnalisée si la réponse est KO
    }

    alert("Utilisateur mis à jour avec succès !");
    window.location.reload();
    // Recharge la page pour refléter les changements
  } catch (error) {
    console.error("Erreur mise à jour utilisateur:", error);
    alert(error.message);
    // Affiche l’erreur s’il y a eu un souci
  }
};

// -----------------------------
// Active/Désactive un utilisateur existant
// -----------------------------
const handleToggleStatus = async () => {
  if (!selectedUser) {
    alert("Aucun utilisateur sélectionné.");
    return;
    // Ne rien faire si aucun utilisateur n’est sélectionné
  }

  try {
    const token = localStorage.getItem("token");
    // Récupère le token d’authentification

    if (!token) {
      alert("Vous devez être connecté pour modifier le statut d'un utilisateur.");
      return;
    }

    const response = await fetch(
      `https://tickevo-backend.vercel.app/users/toggle-status/${selectedUser._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          // En-têtes pour requête authentifiée
        },
      }
    );

    const data = await response.json();
    // Parse la réponse du backend

    if (!response.ok) {
      throw new Error(data.message || "Erreur lors de la mise à jour du statut de l'utilisateur");
    }

    alert(data.message);
    // Affiche un message de confirmation

    // Recharge les données de l'utilisateur mis à jour
    const updatedUserResponse = await fetch(
      `https://tickevo-backend.vercel.app/users/${selectedUser._id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          // Authentifie la requête GET pour récupérer le user mis à jour
        },
      }
    );

    const updatedUserData = await updatedUserResponse.json();
    // Parse les données utilisateur mises à jour

    if (!updatedUserResponse.ok) {
      throw new Error("Impossible de récupérer les nouvelles données.");
    }

    // Met à jour le formulaire avec les nouvelles données utilisateur
    setModifyFormData({
      username: updatedUserData.username,
      password: "",
      roleId: updatedUserData.roleId?._id || updatedUserData.roleId || "",
      serviceId: updatedUserData.serviceId?._id || updatedUserData.serviceId || "",
    });

    selectedUser.isActive = updatedUserData.isActive;
    // Met à jour l’état actif/inactif pour que le bouton affiche la bonne valeur
  } catch (error) {
    console.error("Erreur lors du changement de statut utilisateur:", error);
    alert(error.message);
    // Affiche une erreur en cas de problème
  }
};

  return (
    <div className={styles.card}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === "modify" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("modify")}
        >
          Modifier
        </button>
        <button className={`${styles.tab} ${ activeTab === "create" ? styles.activeTab : "" }`}
          onClick={() => setActiveTab("create")}> Créer </button>
      </div>

      {activeTab === "modify" ? (
        <div className={styles.modifierBox}>
          <h2>
            {selectedUser
              ? `Détails de ${selectedUser.username}`
              : "Modifier un utilisateur"}
          </h2>
          <input
            type="text"
            name="username"
            placeholder="Nom Utilisateur"
            value={modifyFormData.username}
            onChange={handleModifyChange}
            className={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={modifyFormData.password}
            onChange={handleModifyChange}
            className={styles.input}
          />
          <select
            name="roleId"
            value={modifyFormData.roleId}
            onChange={handleModifyChange}
            className={styles.input}
          >
            <option value="">Sélectionner un rôle</option>
            {roles.map((role) => (
              <option key={role._id} value={role._id}>
                {role.roleName}
              </option>
            ))}
          </select>
          <select
            name="serviceId"
            value={modifyFormData.serviceId || ""}
            onChange={handleModifyChange}
            className={styles.input}
          >
            <option value="">Aucun service</option>
            {services.map((service) => (
              <option key={service._id} value={service._id}>
                {service.serviceName}
              </option>
            ))}
          </select>
          <div className={styles.buttonRow}>
            <button
              className={styles.button}
              onClick={handleModifySubmit}
              disabled={!selectedUser}
              style={{
                opacity: !selectedUser ? 0.5 : 1,
                cursor: !selectedUser ? "not-allowed" : "pointer",
              }}
            >
              Sauvegarder
            </button>

            <button
              className={styles.buttonSecondary}
              onClick={handleToggleStatus}
              disabled={!selectedUser}
              style={{
                opacity: !selectedUser ? 0.5 : 1,
                cursor: !selectedUser ? "not-allowed" : "pointer",
              }}
            >
              {selectedUser
                ? selectedUser.isActive
                  ? "Désactiver"
                  : "Activer"
                : "Désactiver/Activer"}
            </button>
          </div>
        </div>
      ) : (
        <form className={styles.createBox} onSubmit={handleCreateSubmit}>
          <h2>Créer un utilisateur</h2>
          <input
            type="text"
            name="username"
            placeholder="Nom Utilisateur"
            value={createFormData.username}
            onChange={handleCreateChange}
            className={styles.input}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={createFormData.email}
            onChange={handleCreateChange}
            className={styles.input}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={createFormData.password}
            onChange={handleCreateChange}
            className={styles.input}
            required
          />
          <select
            name="roleId"
            value={createFormData.roleId}
            onChange={handleCreateChange}
            className={styles.input}
            required
          >
            <option value="">Sélectionner un rôle</option>
            {roles.map((role) => (
              <option key={role._id} value={role._id}>
                {role.roleName}
              </option>
            ))}
          </select>
          <select
            name="serviceId"
            value={createFormData.serviceId}
            onChange={handleCreateChange}
            className={styles.input}
          >
            <option value="">Sélectionner un service</option>
            {services.map((service) => (
              <option key={service._id} value={service._id}>
                {service.serviceName}
              </option>
            ))}
          </select>
          <button className={styles.button} type="submit">
            Créer
          </button>
        </form>
      )}
    </div>
  );
};

export default UserManagement;
