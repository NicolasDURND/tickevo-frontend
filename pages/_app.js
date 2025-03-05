import "../styles/globals.css";
import Head from "next/head";
import { Provider } from "react-redux";
import { store } from "../store";

function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Head>
        <title>Gestion des Tickets</title>
      </Head>
      <Component {...pageProps} />
    </Provider>
  );
}

export default App;
