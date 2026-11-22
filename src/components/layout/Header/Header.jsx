import { useAuth } from '../../../hooks/useAuth';
import styles from './Header.module.css';

function Header() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <header className={styles.header}>
      {user.picture && (
        <img className={styles.avatar} src={user.picture} alt="" referrerPolicy="no-referrer" />
      )}
      <span className={styles.name}>{user.name}</span>
      <button type="button" className={styles.logout} onClick={logout}>
        Logout
      </button>
    </header>
  );
}

export default Header;
