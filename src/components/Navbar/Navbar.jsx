import { Link, useLocation } from 'react-router-dom';
import { Globe } from 'lucide-react';
import styles from './Navbar.module.css';
import logo from '../../assets/logo.png';

function Navbar() {
    const location = useLocation();

    const alternarIdioma = () => {
        console.log('Mudar idioma');
    };

    const obterClasseLink = (path) => {
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
                        <Link to="/" className={obterClasseLink('/')}> 
                            Início
                        </Link>
                    </li>

                    <li>
                        <Link to="/biblioteca" className={obterClasseLink('/biblioteca')}>
                            Biblioteca
                        </Link>
                    </li>

                    <li>
                        <Link to="/equipe" className={obterClasseLink('/equipe')}>
                            Equipe
                        </Link>
                    </li>

                    <li>
                        <Link to="/vestibular" className={obterClasseLink('/vestibular')}>
                            Vestibular
                        </Link>
                    </li>

                    <li>
                        <Link to="/simulados" className={obterClasseLink('/simulados')}>
                            Quiz
                        </Link>
                    </li>

                    <li>
                        <Link to="/videoaulas" className={obterClasseLink('/videoaulas')}>
                            Videoaulas
                        </Link>
                    </li>

                    <li>
                        <Link to="/curiosidades" className={obterClasseLink('/curiosidades')}>
                            Curiosidades
                        </Link>
                    </li>
                </ul>

                <button className={styles.langBtn} onClick={alternarIdioma}>
                    <Globe size={18} />
                    <span>PT/EN</span>
                </button>
            </nav>
        </main>
    );
}

export default Navbar;
