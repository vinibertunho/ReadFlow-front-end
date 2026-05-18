import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

function Navbar() {
  const location = useLocation();

  const getLinkClass = (path) => {
    return location.pathname === path
      ? `${styles.navLink} ${styles.active}`
      : styles.navLink;
  };

    return (
<main className={styles.container}>
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>ReadFlow</div>
      <ul className={styles.links}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/biblioteca">Biblioteca</Link></li>
        <li><Link to="/equipe">Equipe</Link></li>
        <li><Link to="/vestibular">Vestibular</Link></li>
        <li><Link to="/simulados">Quiz</Link></li>
        <li><Link to="/videoaulas">Videoaulas</Link></li>
        <li><Link to="/curiosidades">Curiosidades</Link></li>
      </ul>
    </nav>
</main>
  );
}

export default Navbar;

