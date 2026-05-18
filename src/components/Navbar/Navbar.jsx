import { Link, useLocation } from 'react-router-dom';
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
      <nav className={styles.navbar}>
        <div className={styles.logo}>ReadFlow</div>
        <ul className={styles.links}>
          <li><Link to="/" className={getLinkClass('/')}>Home</Link></li>
          <li><Link to="/biblioteca" className={getLinkClass('/biblioteca')}>Biblioteca</Link></li>
          <li><Link to="/equipe" className={getLinkClass('/equipe')}>Equipe</Link></li>
          <li><Link to="/vestibular" className={getLinkClass('/vestibular')}>Vestibular</Link></li>
          <li><Link to="/simulados" className={getLinkClass('/simulados')}>Quiz</Link></li>
          <li><Link to="/videoaulas" className={getLinkClass('/videoaulas')}>Videoaulas</Link></li>
          <li><Link to="/curiosidades" className={getLinkClass('/curiosidades')}>Curiosidades</Link></li>
        </ul>
      </nav>
    </main>
  );
}

export default Navbar;

