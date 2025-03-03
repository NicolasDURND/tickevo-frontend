import styles from '../styles/HeaderAdministrateur.module.css';
import { IconHome, IconTicket, IconBell, IconLogout, IconPlus, IconSettings } from '@tabler/icons-react';

function HeaderUser() {
  return (
    <div className={styles.header}>
      <div className={styles.logo}>TickEvo</div>
      <nav className={styles.nav}>
        <button className={styles.button}><IconHome size={20} className={styles.icon} /></button>
        <button className={styles.button}><IconTicket size={20} className={styles.icon} /></button>
        <button className={styles.button}><IconBell size={20} className={styles.icon} /></button>
        <button className={styles.button}><IconSettings size={20} className={styles.icon} /></button>
        <button className={styles.button}><IconLogout size={20} className={styles.icon} /></button>
      </nav>
    </div>
  );
}

export default HeaderUser;
