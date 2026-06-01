import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Globe, Menu, X } from 'lucide-react';

import styles from './Navbar.module.css';
import logo from '../../assets/logo.png';

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    const alternarIdioma = () => {
        console.log('Mudar idioma');
    };

    const obterClasseLink = (path) => {
        const isActive = location.pathname === path;
        return isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;
    };

    const fecharMenu = () => setMenuOpen(false);

    return (
        <main className={styles.container}>
            <nav className={styles.navbar}>
                <Link to="/" className={styles.logo} onClick={fecharMenu}>
                    <img className={styles.logoImg} src={logo} alt="Logo ReadFlow" />
                    <span className={styles.logoText}>ReadFlow</span>
                </Link>

                <button
                    className={styles.menuBtn}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
                    aria-expanded={menuOpen}
                >
                    {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                <ul className={`${styles.links} ${menuOpen ? styles.showMenu : ''}`}>
                    <li>
                        <Link to="/" className={obterClasseLink('/')} onClick={fecharMenu}>
                            Início
                        </Link>
                    </li>

                    <li>
                        <Link to="/biblioteca" className={obterClasseLink('/biblioteca')} onClick={fecharMenu}>
                            Biblioteca
                        </Link>
                    </li>

                    <li>
                        <Link to="/livro/capitaes-da-areia" className={obterClasseLink('/livro/capitaes-da-areia')} onClick={fecharMenu}>
                            Explorar Obra
                        </Link>
                    </li>

                    <li>
                        <Link to="/equipe" className={obterClasseLink('/equipe')} onClick={fecharMenu}>
                            Equipe
                        </Link>
                    </li>

                    <li>
                        <Link to="/vestibular" className={obterClasseLink('/vestibular')} onClick={fecharMenu}>
                            Vestibular
                        </Link>
                    </li>

                    <li>
                        <Link to="/simulados" className={obterClasseLink('/simulados')} onClick={fecharMenu}>
                            Quiz
                        </Link>
                    </li>

                    <li>
                        <Link to="/videoaulas" className={obterClasseLink('/videoaulas')} onClick={fecharMenu}>
                            Videoaulas
                        </Link>
                    </li>

                    <li>
                        <Link to="/curiosidades" className={obterClasseLink('/curiosidades')} onClick={fecharMenu}>
                            Curiosidades
                        </Link>
                    </li>

                    <button className={styles.langBtnMobile} onClick={alternarIdioma} type="button">
                        <Globe size={18} />
                        <span>PT/EN</span>
                    </button>
                </ul>

                <button className={styles.langBtn} onClick={alternarIdioma} type="button">
                    <Globe size={18} />
                    <span>PT/EN</span>
                </button>
            </nav>
        </main>
    );
}

export default Navbar;
