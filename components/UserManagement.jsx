import React, { useState, useEffect } from "react";
import styles from "../styles/Admin.module.css";

const UserManagement = ({ selectedUser }) => {
  const [activeTab, setActiveTab] = useState("modify");
  const [roles, setRoles] = useState([]);
  const [services, setServices] = useState([]);

  // ✅ États des formulaires
  const [modifyFormData, setModifyFormData] = useState({
    username: "",
    password: "",
    roleId: "",
    serviceId: "",
  });
  const [createFormData, setCreateFormData] = useState({
    username: "",
    email: "",
    password: "",
    roleId: "",
    serviceId: "",
  });

  // ✅ Récupérer les rôles et services depuis le backend
  useEffect(() => {
    const fetchRolesAndServices = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Vous devez être connecté pour voir les rôles et services.");
          return;
        }

        const [rolesResponse, servicesResponse] = await Promise.all([
          fetch("http://localhost:3000/users/roles", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch("http://localhost:3000/users/services", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const rolesData = await rolesResponse.json();
        const servicesData = await servicesResponse.json();

        if (rolesResponse.ok) {
          setRoles(rolesData.roles);
        } else {
          console.error(
            "Erreur lors du chargement des rôles:",
            rolesData.error
          );
        }

        if (servicesResponse.ok) {
          setServices(servicesData.services);
        } else {
          console.error(
            "Erreur lors du chargement des services:",
            servicesData.error
          );
        }
      } catch (error) {
        console.error("Erreur serveur:", error);
      }
    };

    fetchRolesAndServices();
  }, []);

  // ✅ Met à jour les champs si un utilisateur est sélectionné
  useEffect(() => {
    if (selectedUser) {
      setActiveTab("modify");
      setModifyFormData({
        username: selectedUser.username || "",
        password: "",
        roleId: selectedUser.roleId?._id || selectedUser.roleId || "",
        serviceId: selectedUser.serviceId?._id || selectedUser.serviceId || "",
      });
    }
  }, [selectedUser]);

  // ✅ Gestion des changements de champs
  const handleModifyChange = (e) => {
    let value = e.target.value;
    if (e.target.name === "serviceId" && value === "") {
      value = null;
    }
    setModifyFormData({ ...modifyFormData, [e.target.name]: value });
  };

  const handleCreateChange = (e) => {
    setCreateFormData({ ...createFormData, [e.target.name]: e.target.value });
  };

  // ✅ Fonction pour soumettre la création d'un utilisateur (POST - signupAdmin)
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté pour créer un utilisateur.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/users/signupAdmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(createFormData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Utilisateur créé avec succès !");
        window.location.reload(); // ✅ Recharge la page après création
      } else {
        alert(data.error || "Erreur lors de la création de l'utilisateur.");
      }
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur:", error);
      alert("Erreur serveur");
    }
  };

  // ✅ Fonction pour modifier un utilisateur (PATCH)
  const handleModifySubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) {
      alert("Aucun utilisateur sélectionné.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vous devez être connecté pour modifier un utilisateur.");
        return;
      }

      const response = await fetch(
        `http://localhost:3000/users/update/${selectedUser._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(modifyFormData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Erreur lors de la mise à jour de l'utilisateur"
        );
      }

      alert("Utilisateur mis à jour avec succès !");
      window.location.reload(); // ✅ Recharge la page après modification
    } catch (error) {
      console.error("Erreur mise à jour utilisateur:", error);
      alert(error.message);
    }
  };

  // ✅ Fonction pour désactiver/activer un utilisateur (PATCH - toggle-status)
  const handleToggleStatus = async () => {
    if (!selectedUser) {
      alert("Aucun utilisateur sélectionné.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vous devez être connecté pour modifier le statut d'un utilisateur.");
        return;
      }
  
      const response = await fetch(
        `http://localhost:3000/users/toggle-status/${selectedUser._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la mise à jour du statut de l'utilisateur");
      }
  
      alert(`Utilisateur ${data.success ? "activé" : "désactivé"} avec succès !`);
  
      // ✅ Récupérer les nouvelles données de l'utilisateur depuis la base de données
      const updatedUserResponse = await fetch(
        `http://localhost:3000/users/${selectedUser._id}`, // Assure-toi d'avoir une route GET pour récupérer un utilisateur par ID
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const updatedUserData = await updatedUserResponse.json();
  
      if (!updatedUserResponse.ok) {
        throw new Error("Impossible de récupérer les nouvelles données.");
      }
  
      // ✅ Mettre à jour `selectedUser` avec les nouvelles données
      setModifyFormData({
        username: updatedUserData.username,
        password: "",
        roleId: updatedUserData.roleId?._id || updatedUserData.roleId || "",
        serviceId: updatedUserData.serviceId?._id || updatedUserData.serviceId || "",
      });
  
      // ✅ Mettre à jour `selectedUser` pour re-render le bouton correctement
      selectedUser.isActive = updatedUserData.isActive;
  
    } catch (error) {
      console.error("Erreur lors du changement de statut utilisateur:", error);
      alert(error.message);
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
        <button
          className={`${styles.tab} ${
            activeTab === "create" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("create")}
        >
          Créer
        </button>
      </div>

      {activeTab === "modify" ? (
        <div className={styles.modifierBox}>
          <h2>
            {selectedUser
              ? `Détails ${selectedUser.username}`
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
              disabled={!selectedUser} // ✅ Désactive le bouton si aucun utilisateur sélectionné
              style={{
                opacity: !selectedUser ? 0.5 : 1, // ✅ Grise le bouton quand il est désactivé
                cursor: !selectedUser ? "not-allowed" : "pointer", // ✅ Change le pointeur en fonction de l'état du bouton
              }}
            >
              Sauvegarder
            </button>

            <button
              className={styles.buttonSecondary}
              onClick={handleToggleStatus}
              disabled={!selectedUser} // ✅ Désactive le bouton si aucun utilisateur sélectionné
              style={{
                opacity: !selectedUser ? 0.5 : 1, // ✅ Grise le bouton quand il est désactivé
                cursor: !selectedUser ? "not-allowed" : "pointer", // ✅ Change le pointeur en fonction de l'état du bouton
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
