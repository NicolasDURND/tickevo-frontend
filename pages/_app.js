import "../styles/globals.css"; // Import global styles
import Head from "next/head"; // Import Head to manage page title and meta
import { Provider } from "react-redux"; // Import Provider to wrap Redux store
import { store } from "../store"; // Import the configured Redux store
import { useEffect } from "react"; // Import useEffect to handle side effects
import { useDispatch } from "react-redux"; // Import Redux dispatcher
import { setUser, logout } from "../reducers/authentification"; // Import actions from the auth reducer
import { useRouter } from "next/router"; // Import Next.js router to handle redirection

function App({ Component, pageProps }) {
  return (
    <Provider store={store}> {/* Wrap the entire app with Redux store */}
      <SessionChecker /> {/* Component to check session at initial load */}
      <Head>
        <title>Gestion des Tickets</title> {/* Page title */}
      </Head>
      <Component {...pageProps} /> {/* Render the actual page */}
    </Provider>
  );
}

// Component responsible for checking session and managing redirection
function SessionChecker() {
  const dispatch = useDispatch(); // Initialize Redux dispatcher
  const router = useRouter(); // Initialize Next.js router

  useEffect(() => {
    // Retrieve token and user from localStorage if present
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null; 
    const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user")) : null;

    if (token && user) {
      // If token and user exist, dispatch setUser to restore session in Redux
      dispatch(setUser({ user, token }));
    } else {
      // If session data is missing, clear Redux and localStorage by dispatching logout
      dispatch(logout());

      // If the current page is not the login page, redirect to login
      if (router.pathname !== "/") {
        router.push("/");
      }
    }
  }, [dispatch, router]); // Dependencies: dispatch and router

  return null; // This component does not render anything
}

export default App; // Export the main App component

