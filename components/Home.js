import HeaderTechnicien from './HeaderTechnicien';
import styles from '../styles/Home.module.css';

function Home() {
  return (
    <div>
      <HeaderTechnicien/>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Tickevo !
        </h1>
      </main>
    </div>
  );
}

export default Home;
