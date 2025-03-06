import { createSlice } from "@reduxjs/toolkit";

// État initial de l'authentification
const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const loginSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;

      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload.token); // Sauvegarde du token après login
        localStorage.setItem("user", JSON.stringify(action.payload.user)); // Sauvegarde du user
      }
    },
    loginFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("token"); // Nettoyage
        localStorage.removeItem("user");
      }
    },
    setUser: (state, action) => {
      state.user = action.payload.user; // Recharge le user
      state.token = action.payload.token; // Recharge le token
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, setUser } =
  loginSlice.actions;

export default loginSlice.reducer;
