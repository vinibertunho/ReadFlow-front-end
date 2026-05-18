import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import styles from './Navbar.module.css';

function Navbar() {
    const toggleLanguage = () => {
        console.log('Mudar idioma');
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <Link to="/" className={styles.logoImg}>
                    <img src={logo} alt="Logo ReadFlow" className={styles.logoImage} />
                    <span className={styles.logoText}>ReadFlow</span>
                </Link>
            </div>
            <ul className={styles.links}>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/biblioteca">Biblioteca</Link>
                </li>
                <li>
                    <Link to="/equipe">Equipe</Link>
                </li>
                <li>
                    <Link to="/vestibular">Vestibular</Link>
                </li>
                <li>
                    <Link to="/simulados">Quiz</Link>
                </li>
                <li>
                    <Link to="/videoaulas">Videoaulas</Link>
                </li>
                <li>
                    <Link to="/curiosidades">Curiosidades</Link>
                </li>
            </ul>

            <button className={styles.langBtn} onClick={toggleLanguage}>
                <span>PT/EN</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
            </button>
        </nav>
    );
}

export default Navbar;
