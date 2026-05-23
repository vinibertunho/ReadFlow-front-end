import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Globe, Menu, X } from 'lucide-react';

import styles from './Navbar.module.css';
import logo from '../../assets/logo.png';

function Navbar() {
    const [activeLink, setActiveLink] = useState('/');
    const [menuOpen, setMenuOpen] = useState(false);

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
                    <img className={styles.logoImg} src={logo} alt="Logo ReadFlow" />
                    ReadFlow
                </div>

                <button className={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                <ul className={`${styles.links} ${menuOpen ? styles.showMenu : ''}`}>
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

                    <button className={styles.langBtnMobile} onClick={toggleLanguage}>
                        <Globe size={18} />
                        <span>PT/EN</span>
                    </button>
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
