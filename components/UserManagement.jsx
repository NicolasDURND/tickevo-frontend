import React, { useState, useEffect } from "react";
import styles from "../styles/Admin.module.css";

const UserManagement = ({ selectedUser }) => {
  const [activeTab, setActiveTab] = useState("modify");
  const [roles, setRoles] = useState([]);
  const [services, setServices] = useState([]);

  // ✅ États des formulaires
  const [modifyFormData, setModifyFormData] = useState({  username: "",  password: "",  roleId: "",  serviceId: "", });

  const [createFormData, setCreateFormData] = useState({ username: "", email: "", password: "", roleId: "", serviceId: "", });

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

    // ✅ Si l'utilisateur ne sélectionne aucun service, on envoie `null`
    if (e.target.name === "serviceId" && value === "") {
      value = null;
    }

    setModifyFormData({ ...modifyFormData, [e.target.name]: value });
  };

  const handleCreateChange = (e) => {
    setCreateFormData({ ...createFormData, [e.target.name]: e.target.value });
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
          body: JSON.stringify(modifyFormData), // Envoie uniquement les champs modifiés
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Erreur lors de la mise à jour de l'utilisateur"
        );
      }

      alert("Utilisateur mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur mise à jour utilisateur:", error);
      alert(error.message);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${activeTab === "modify" ? styles.activeTab : ""}`} onClick={() => setActiveTab("modify")}>Modifier</button>
        <button className={`${styles.tab} ${activeTab === "create" ? styles.activeTab : ""}`} onClick={() => setActiveTab("create")}>Créer</button>
      </div>

      {activeTab === "modify" ? (
        <div className={styles.modifierBox}>
          <h2> {selectedUser ? `Détails ${selectedUser.username}`
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

          {/* ✅ Sélection dynamique des rôles */}
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

          {/* ✅ Sélection dynamique des services avec option "Aucun service" */}
          <select
            name="serviceId"
            value={modifyFormData.serviceId || ""}
            onChange={handleModifyChange}
            className={styles.input}
          >
            <option value="">Aucun service</option>{" "}
            {/* 🔥 Ajout de cette option */}
            {services.map((service) => (
              <option key={service._id} value={service._id}>
                {service.serviceName}
              </option>
            ))}
          </select>

          <div className={styles.buttonRow}>
            <button className={styles.button} onClick={handleModifySubmit}>
              Sauvegarder
            </button>
            <button className={styles.buttonSecondary}>Désactiver</button>
          </div>
        </div>
      ) : (
        <form className={styles.createBox}>
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

          {/* ✅ Sélection dynamique des rôles */}
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

          {/* ✅ Sélection dynamique des services */}
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
