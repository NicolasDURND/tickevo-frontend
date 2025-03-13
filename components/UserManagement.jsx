import React, { useState, useEffect } from "react";
import styles from "../styles/Admin.module.css";

const UserManagement = ({ selectedUser }) => {
  // Tab state: either "modify" or "create"
  const [activeTab, setActiveTab] = useState("modify");
  // State to store roles and services data fetched from the backend
  const [roles, setRoles] = useState([]);
  const [services, setServices] = useState([]);

  // State for the modification form data
  const [modifyFormData, setModifyFormData] = useState({
    username: "",
    password: "",
    roleId: "",
    serviceId: "",
  });
  // State for the creation form data
  const [createFormData, setCreateFormData] = useState({
    username: "",
    email: "",
    password: "",
    roleId: "",
    serviceId: "",
  });

  // -----------------------------
  // Fetch roles and services on component mount
  // -----------------------------
  useEffect(() => {
    const fetchRolesAndServices = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Vous devez être connecté pour voir les rôles et services.");
          return;
        }

        // Fetch roles and services concurrently
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
          console.error("Erreur lors du chargement des rôles:", rolesData.error);
        }

        if (servicesResponse.ok) {
          setServices(servicesData.services);
        } else {
          console.error("Erreur lors du chargement des services:", servicesData.error);
        }
      } catch (error) {
        console.error("Erreur serveur:", error);
      }
    };

    fetchRolesAndServices();
  }, []);

  // -----------------------------
  // Update modification form when selectedUser changes
  // -----------------------------
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

  // -----------------------------
  // Handlers for form field changes
  // -----------------------------
  const handleModifyChange = (e) => {
    let { name, value } = e.target;
    // If the serviceId is set to an empty string, set its value to null
    if (name === "serviceId" && value === "") {
      value = null;
    }
    setModifyFormData({ ...modifyFormData, [name]: value });
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData({ ...createFormData, [name]: value });
  };

  // -----------------------------
  // Submit handler for creating a new user
  // -----------------------------
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
        window.location.reload(); // Reload page after successful creation
      } else {
        alert(data.error || "Erreur lors de la création de l'utilisateur.");
      }
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur:", error);
      alert("Erreur serveur");
    }
  };

  // -----------------------------
  // Submit handler for modifying an existing user
  // -----------------------------
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
      window.location.reload(); // Reload page after successful modification
    } catch (error) {
      console.error("Erreur mise à jour utilisateur:", error);
      alert(error.message);
    }
  };

  // -----------------------------
  // Handler for toggling user status (activate/deactivate)
  // -----------------------------
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

      alert(data.message);

      // Fetch the updated user data
      const updatedUserResponse = await fetch(
        `http://localhost:3000/users/${selectedUser._id}`,
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

      // Update the modify form with new user data
      setModifyFormData({
        username: updatedUserData.username,
        password: "",
        roleId: updatedUserData.roleId?._id || updatedUserData.roleId || "",
        serviceId: updatedUserData.serviceId?._id || updatedUserData.serviceId || "",
      });

      // Update selectedUser status to re-render button label correctly
      selectedUser.isActive = updatedUserData.isActive;
    } catch (error) {
      console.error("Erreur lors du changement de statut utilisateur:", error);
      alert(error.message);
    }
  };

  // -----------------------------
  // Render the component UI
  // -----------------------------
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
