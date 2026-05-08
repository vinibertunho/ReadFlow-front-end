import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

function Navbar() {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? styles.active : '';
    };

    return (
        <nav className={styles.navbar}>
            <Link to="/" className={styles.navBrand}>
                ReadFlow
            </Link>
            <ul className={styles.navLinks}>
                <li>
                    <Link to="/" className={isActive('/')}>
                        Início
                    </Link>
                </li>
                <li>
                    <Link to="/biblioteca" className={isActive('/biblioteca')}>
                        Biblioteca
                    </Link>
                </li>
                <li>
                    <Link to="/livro/1" className={isActive('/livro/1')}>
                        Explorar obra
                    </Link>
                </li>
                <li>
                    <Link to="/equipe" className={isActive('/equipe')}>
                        Equipe
                    </Link>
                </li>
                <li>
                    <Link to="/vestibular" className={isActive('/vestibular')}>
                        Vestibulandos
                    </Link>
                </li>
                <li>
                    <Link to="/simulados" className={isActive('/simulados')}>
                        Quiz
                    </Link>
                </li>
                <li>
                    <Link to="/videoaulas" className={isActive('/videoaulas')}>
                        Vídeos
                    </Link>
                </li>
                <li>
                    <Link to="/curiosidades" className={isActive('/curiosidades')}>
                        Curiosidades
                    </Link>
                </li>
            </ul>
            <div className={styles.navLang}>PT/EN 🌐</div>
        </nav>
    );
}

export default Navbar;
