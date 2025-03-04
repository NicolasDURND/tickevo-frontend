import styles from "../styles/Login.module.css";

function Login() {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <img src="/LogoV2.jpg" alt="logo" width={250} height={200} />
      </div>

      <div className={styles.input}>
        <input
          className={styles.username}
          type="text"
          placeholder="Nom d'utilisateur"
        />
        <br />
        <input
          className={styles.password}
          type="password"
          placeholder="Mot de passe"
        />

        <button className={styles.loginButton}> Connexion</button>
      </div>
    </div>
  );
}

export default Login;
