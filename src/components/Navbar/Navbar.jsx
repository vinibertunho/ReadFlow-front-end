import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Globe, Menu, X } from 'lucide-react';

import styles from './Navbar.module.css';
import logo from '../../assets/logo.png';

function Navbar() {
    const [activeLink, setActiveLink] = useState('/');
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleLanguage = () => {
        console.log('Mudar idioma');
    };

    const getLinkClass = (path) => {
        return activeLink === path ? `${styles.navLink} ${styles.active}` : styles.navLink;
    };

    const handleLinkClick = (path) => {
        setActiveLink(path);
        setMenuOpen(false);
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
                        <Link
                            to="/"
                            className={getLinkClass('/')}
                            onClick={() => handleLinkClick('/')}>
                            Início
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/livro"
                            className={getLinkClass('/livro')}
                            onClick={() => handleLinkClick('/livro')}>
                            Explorar obra
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/biblioteca"
                            className={getLinkClass('/biblioteca')}
                            onClick={() => handleLinkClick('/biblioteca')}>
                            Biblioteca
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/equipe"
                            className={getLinkClass('/equipe')}
                            onClick={() => handleLinkClick('/equipe')}>
                            Equipe
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/vestibular"
                            className={getLinkClass('/vestibular')}
                            onClick={() => handleLinkClick('/vestibular')}>
                            Vestibular
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/simulados"
                            className={getLinkClass('/simulados')}
                            onClick={() => handleLinkClick('/simulados')}>
                            Quiz
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/videoaulas"
                            className={getLinkClass('/videoaulas')}
                            onClick={() => handleLinkClick('/videoaulas')}>
                            Videoaulas
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/curiosidades"
                            className={getLinkClass('/curiosidades')}
                            onClick={() => handleLinkClick('/curiosidades')}>
                            Curiosidades
                        </Link>
                    </li>

                    <button className={styles.langBtnMobile} onClick={toggleLanguage}>
                        <Globe size={18} />
                        <span>PT/EN</span>
                    </button>
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
