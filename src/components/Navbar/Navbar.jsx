import { Link, useLocation } from 'react-router-dom';
import { Globe } from 'lucide-react';
import styles from './Navbar.module.css';
import logo from '../../assets/logo.png';

function Navbar() {
    const location = useLocation();

    const toggleLanguage = () => {
        console.log('Mudar idioma');
    };

    const getLinkClass = (path) => {
        return location.pathname === path ? `${styles.navLink} ${styles.active}` : styles.navLink;
    };

    return (
        <main className={styles.container}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>
                    <img className={styles.logoImg} src={logo} alt="Logo ReadFlow" /> ReadFlow
                </div>

                <ul className={styles.links}>
                    <li>
                        <Link to="/" className={getLinkClass('/')}>
                            Home
                        </Link>
                    </li>

                    <li>
                        <Link to="/biblioteca" className={getLinkClass('/biblioteca')}>
                            Biblioteca
                        </Link>
                    </li>

                    <li>
                        <Link to="/equipe" className={getLinkClass('/equipe')}>
                            Equipe
                        </Link>
                    </li>

                    <li>
                        <Link to="/vestibular" className={getLinkClass('/vestibular')}>
                            Vestibular
                        </Link>
                    </li>

                    <li>
                        <Link to="/simulados" className={getLinkClass('/simulados')}>
                            Quiz
                        </Link>
                    </li>

                    <li>
                        <Link to="/videoaulas" className={getLinkClass('/videoaulas')}>
                            Videoaulas
                        </Link>
                    </li>

                    <li>
                        <Link to="/curiosidades" className={getLinkClass('/curiosidades')}>
                            Curiosidades
                        </Link>
                    </li>
                </ul>

                <button className={styles.langBtn} onClick={toggleLanguage}>
                    <Globe size={18} />
                    <span>PT/EN</span>
                </button>
            </nav>
        </main>
    );
}

export default Navbar;
