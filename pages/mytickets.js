import HeaderUser from "../components/HeaderUser";
import MyTickets from "../components/MyTickets";
import styles from "../styles/MyTickets.module.css";

export default function MyTicketsPage() {
  return (
    <div className={styles.main}>
      <HeaderUser />
      <div className={styles.container}>
        <MyTickets />
      </div>
    </div>
  );
}
