import React, { useState, useEffect } from "react"; import styles from "../styles/Admin.module.css";

const UserManagement = ({ selectedUser }) => {
  const [activeTab, setActiveTab] = useState("modify");

  // ✅ Liste statique des rôles et services
  const roles = [{ _id: "67c5cfc16f453c87fb23c607", roleName: "Administrateur" }, { _id: "67c5cfc16f453c87fb23c609", roleName: "Technicien" }, { _id: "67c5cfc16f453c87fb23c60b", roleName: "Utilisateur" }];
  const services = [{ _id: "67caf5c2ed8b68e141a90e71", serviceName: "Support IT" }];

  // ✅ États des formulaires
  const [modifyFormData, setModifyFormData] = useState({ username: "", password: "", role: "", service: "" });
  const [createFormData, setCreateFormData] = useState({ username: "", email: "", password: "", role: "", service: "" });

  // ✅ Met à jour les champs si un utilisateur est sélectionné
  useEffect(() => { if (selectedUser) { setActiveTab("modify"); setModifyFormData({ username: selectedUser.username || "", password: "", role: selectedUser.role || "", service: selectedUser.service || "" }); } }, [selectedUser]);

  // ✅ Gestion des changements de champs
  const handleModifyChange = (e) => { setModifyFormData({ ...modifyFormData, [e.target.name]: e.target.value }); };
  const handleCreateChange = (e) => { setCreateFormData({ ...createFormData, [e.target.name]: e.target.value }); };

  return (
    <div className={styles.card}>
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${activeTab === "modify" ? styles.activeTab : ""}`} onClick={() => setActiveTab("modify")}>Modifier</button>
        <button className={`${styles.tab} ${activeTab === "create" ? styles.activeTab : ""}`} onClick={() => setActiveTab("create")}>Créer</button>
      </div>

      {activeTab === "modify" ? (
        <div className={styles.modifierBox}>
          <h2>{selectedUser ? `Détails ${selectedUser.username}` : "Modifier un utilisateur"}</h2>
          <input type="text" name="username" placeholder="Nom Utilisateur" value={modifyFormData.username} onChange={handleModifyChange} className={styles.input} />
          <input type="password" name="password" placeholder="Mot de passe" value={modifyFormData.password} onChange={handleModifyChange} className={styles.input} />
          <select name="role" value={modifyFormData.role} onChange={handleModifyChange}>
            {roles.map((r) => <option key={r._id} value={r.roleName}>{r.roleName}</option>)}
          </select>
          <select name="service" value={modifyFormData.service || ""} onChange={handleModifyChange}>
            <option value="">Sélectionner un service</option>
            {services.map((s) => <option key={s._id} value={s._id}>{s.serviceName}</option>)}
          </select>
          <div className={styles.buttonRow}>
            <button className={styles.button}>Sauvegarder</button>
            <button className={styles.buttonSecondary}>Désactiver</button>
          </div>
        </div>
      ) : (
        <div className={styles.createBox}>
          <h2>Créer un utilisateur</h2>
          <input type="text" name="username" placeholder="Nom Utilisateur" value={createFormData.username} onChange={handleCreateChange} className={styles.input} />
          <input type="email" name="email" placeholder="Email" value={createFormData.email} onChange={handleCreateChange} className={styles.input} />
          <input type="password" name="password" placeholder="Mot de passe" value={createFormData.password} onChange={handleCreateChange} className={styles.input} />
          <select name="role" value={createFormData.role} onChange={handleCreateChange} className={styles.input}>
            <option value="">Sélectionner un rôle</option>
            {roles.map((role) => <option key={role._id} value={role._id}>{role.roleName}</option>)}
          </select>
          <select name="service" value={createFormData.service} onChange={handleCreateChange} className={styles.input}>
            <option value="">Sélectionner un service</option>
            {services.map((service) => <option key={service._id} value={service._id}>{service.serviceName}</option>)}
          </select>
          <button className={styles.button}>Créer</button>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
