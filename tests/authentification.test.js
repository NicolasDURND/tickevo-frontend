// ✅ Importation du reducer et des actions Redux à tester
import authentificationReducer, {
  loginSuccess,
  logout,
} from "../reducers/authentification";

// ✅ Définition du bloc de test pour le reducer d'authentification
describe("Authentification Reducer", () => {
  // 📌 État initial du reducer (correspond à l'état défini dans le fichier `authentification.js`)
  const initialState = {
    user: null, // Aucun utilisateur connecté par défaut
    token: null, // Aucun token JWT par défaut
    loading: false, // Pas de requête en cours
    error: null, // Pas d'erreur
  };

  // ✅ Test de l'action `loginSuccess`
  test("Should set user and token on loginSuccess", () => {
    // 📌 Données fictives simulant un utilisateur connecté
    const fakeUser = { username: "testUser", role: "user" };
    const fakeToken = "fake-jwt-token";

    // 📌 Création de l'action Redux en appelant `loginSuccess`
    const action = loginSuccess({ user: fakeUser, token: fakeToken });

    // 📌 Application de l'action au reducer
    const newState = authentificationReducer(initialState, action);

    // 📌 Vérification que le state est mis à jour correctement après connexion
    expect(newState.user).toEqual(fakeUser); // L'utilisateur doit être défini
    expect(newState.token).toEqual(fakeToken); // Le token doit être enregistré
  });

  // ✅ Test de l'action `logout`
  test("Should clear user and token on logout", () => {
    // 📌 Simulation d'un état où l'utilisateur est connecté
    const loggedInState = {
      user: { username: "testUser", role: "user" }, // Utilisateur connecté
      token: "fake-jwt-token", // Token JWT actif
      loading: false,
      error: null,
    };

    // 📌 Exécution de l'action `logout` pour simuler une déconnexion
    const newState = authentificationReducer(loggedInState, logout());

    // 📌 Vérification que le state est bien réinitialisé après déconnexion
    expect(newState.user).toBeNull(); // L'utilisateur doit être supprimé
    expect(newState.token).toBeNull(); // Le token doit être supprimé
  });
});

