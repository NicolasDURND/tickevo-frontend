import React, { useState, useEffect } from "react";
import styles from "../styles/Admin.module.css";

const UserManagement = ({ selectedUser }) => {
  const [activeTab, setActiveTab] = useState("modify");

  // ✅ Liste des rôles et services
  const roles = [
    { _id: "67c5cfc16f453c87fb23c607", roleName: "Administrateur" },
    { _id: "67c5cfc16f453c87fb23c609", roleName: "Technicien" },
    { _id: "67c5cfc16f453c87fb23c60b", roleName: "Utilisateur" }
  ];
  const services = [{ _id: "67caf5c2ed8b68e141a90e71", serviceName: "Support IT" }];

  // ✅ États des formulaires
  const [modifyFormData, setModifyFormData] = useState({
    username: "",
    password: "",
    roleId: "",
    serviceId: ""
  });

  const [createFormData, setCreateFormData] = useState({
    username: "",
    email: "",
    password: "",
    roleId: "",
    serviceId: ""
  });

  // ✅ Met à jour les champs si un utilisateur est sélectionné
  useEffect(() => {
    if (selectedUser) {
      setActiveTab("modify");
      setModifyFormData({
        username: selectedUser.username || "",
        password: "",
        roleId: selectedUser.roleId?._id || selectedUser.roleId || "", // 🔥 Vérifie si c'est un objet ou une string
        serviceId: selectedUser.serviceId?._id || selectedUser.serviceId || "" // 🔥 Idem pour service
      });
    }
  }, [selectedUser]);

  // ✅ Gestion des changements de champs
  const handleModifyChange = (e) => {
    setModifyFormData({ ...modifyFormData, [e.target.name]: e.target.value });
  };

  const handleCreateChange = (e) => {
    setCreateFormData({ ...createFormData, [e.target.name]: e.target.value });
  };

  // ✅ Soumission du formulaire de création avec Fetch API
  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    // 🔥 Récupération du token utilisateur
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Vous devez être connecté pour ajouter un utilisateur.");
      return;
    }

    // Préparation des données à envoyer
    const requestData = {
      username: createFormData.username,
      email: createFormData.email,
      password: createFormData.password,
      roleId: createFormData.roleId // ✅ Correct
    };

    if (createFormData.serviceId) {
      requestData.serviceId = createFormData.serviceId; // ✅ Ajout seulement si renseigné
    }

    try {
      const response = await fetch("http://localhost:3000/users/signupAdmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` // ✅ Ajout du token dans l'en-tête
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la création de l'utilisateur");
      }

      alert("Utilisateur créé avec succès !");
      setCreateFormData({ username: "", email: "", password: "", roleId: "", serviceId: "" });

    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur:", error);
      alert(error.message);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${activeTab === "modify" ? styles.activeTab : ""}`} onClick={() => setActiveTab("modify")}>
          Modifier
        </button>
        <button className={`${styles.tab} ${activeTab === "create" ? styles.activeTab : ""}`} onClick={() => setActiveTab("create")}>
          Créer
        </button>
      </div>

      {activeTab === "modify" ? (
        <div className={styles.modifierBox}>
          <h2>{selectedUser ? `Détails ${selectedUser.username}` : "Modifier un utilisateur"}</h2>
          <input type="text" name="username" placeholder="Nom Utilisateur" value={modifyFormData.username} onChange={handleModifyChange} className={styles.input} />
          <input type="password" name="password" placeholder="Mot de passe" value={modifyFormData.password} onChange={handleModifyChange} className={styles.input} />
          
          {/* ✅ Sélection du rôle qui doit être pré-rempli */}
          <select name="roleId" value={modifyFormData.roleId} onChange={handleModifyChange} className={styles.input}>
            <option value="">Sélectionner un rôle</option>
            {roles.map((role) => (
              <option key={role._id} value={role._id}>{role.roleName}</option>
            ))}
          </select>

          {/* ✅ Sélection du service qui doit être pré-rempli */}
          <select name="serviceId" value={modifyFormData.serviceId || ""} onChange={handleModifyChange} className={styles.input}>
            <option value="">Sélectionner un service</option>
            {services.map((service) => (
              <option key={service._id} value={service._id}>{service.serviceName}</option>
            ))}
          </select>

          <div className={styles.buttonRow}>
            <button className={styles.button}>Sauvegarder</button>
            <button className={styles.buttonSecondary}>Désactiver</button>
          </div>
        </div>
      ) : (
        <form className={styles.createBox} onSubmit={handleCreateSubmit}>
          <h2>Créer un utilisateur</h2>
          <input type="text" name="username" placeholder="Nom Utilisateur" value={createFormData.username} onChange={handleCreateChange} className={styles.input} required />
          <input type="email" name="email" placeholder="Email" value={createFormData.email} onChange={handleCreateChange} className={styles.input} required />
          <input type="password" name="password" placeholder="Mot de passe" value={createFormData.password} onChange={handleCreateChange} className={styles.input} required />

          <select name="roleId" value={createFormData.roleId} onChange={handleCreateChange} className={styles.input} required>
            <option value="">Sélectionner un rôle</option>
            {roles.map((role) => <option key={role._id} value={role._id}>{role.roleName}</option>)}
          </select>

          <select name="serviceId" value={createFormData.serviceId} onChange={handleCreateChange} className={styles.input}>
            <option value="">Sélectionner un service</option>
            {services.map((service) => <option key={service._id} value={service._id}>{service.serviceName}</option>)}
          </select>

          <button className={styles.button} type="submit">Créer</button>
        </form>
      )}
    </div>
  );
};

export default UserManagement;
