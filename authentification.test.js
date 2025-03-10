import authentificationReducer, {
  loginSuccess,
  logout,
} from "./reducers/authentification";

describe("Authentification Reducer", () => {
  const initialState = {
    user: null,
    token: null,
    loading: false,
    error: null,
  };

  test("Should set user and token on loginSuccess", () => {
    const fakeUser = { username: "testUser", role: "user" };
    const fakeToken = "fake-jwt-token";

    const action = loginSuccess({ user: fakeUser, token: fakeToken });
    const newState = authentificationReducer(initialState, action);

    expect(newState.user).toEqual(fakeUser);
    expect(newState.token).toEqual(fakeToken);
  });

  test("Should clear user and token on logout", () => {
    const loggedInState = {
      user: { username: "testUser", role: "user" },
      token: "fake-jwt-token",
      loading: false,
      error: null,
    };

    const newState = authentificationReducer(loggedInState, logout());

    expect(newState.user).toBeNull();
    expect(newState.token).toBeNull();
  });
});
