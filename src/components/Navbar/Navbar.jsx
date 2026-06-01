import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Globe, Menu, X } from 'lucide-react';

import styles from './Navbar.module.css';
import logo from '../../assets/logo.png';
import { useIdioma } from '../../context/IdiomaContext';

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const { idioma, alternarIdioma } = useIdioma();

    const obterClasseLink = (path) => {
        const isActive = location.pathname === path;
        return isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;
    };

    const fecharMenu = () => setMenuOpen(false);

    const t = {
        inicio: idioma === 'PT' ? 'Início' : 'Home',
        biblioteca: idioma === 'PT' ? 'Biblioteca' : 'Library',
        explorar: idioma === 'PT' ? 'Explorar Obra' : 'Explore Book',
        equipe: idioma === 'PT' ? 'Equipe' : 'Team',
        vestibular: idioma === 'PT' ? 'Vestibular' : 'Exam Prep',
        quiz: idioma === 'PT' ? 'Quiz' : 'Quiz',
        videoaulas: idioma === 'PT' ? 'Videoaulas' : 'Video Lessons',
        curiosidades: idioma === 'PT' ? 'Curiosidades' : 'Fun Facts',
    };

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
                    aria-expanded={menuOpen}>
                    {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                <ul className={`${styles.links} ${menuOpen ? styles.showMenu : ''}`}>
                    <li>
                        <Link to="/" className={obterClasseLink('/')} onClick={fecharMenu}>
                            {t.inicio}
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/biblioteca"
                            className={obterClasseLink('/biblioteca')}
                            onClick={fecharMenu}>
                            {t.biblioteca}
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/livro/capitaes-da-areia"
                            className={obterClasseLink('/livro/capitaes-da-areia')}
                            onClick={fecharMenu}>
                            {t.explorar}
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/equipe"
                            className={obterClasseLink('/equipe')}
                            onClick={fecharMenu}>
                            {t.equipe}
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/vestibular"
                            className={obterClasseLink('/vestibular')}
                            onClick={fecharMenu}>
                            {t.vestibular}
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/simulados"
                            className={obterClasseLink('/simulados')}
                            onClick={fecharMenu}>
                            {t.quiz}
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/videoaulas"
                            className={obterClasseLink('/videoaulas')}
                            onClick={fecharMenu}>
                            {t.videoaulas}
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/curiosidades"
                            className={obterClasseLink('/curiosidades')}
                            onClick={fecharMenu}>
                            {t.curiosidades}
                        </Link>
                    </li>

                    <button className={styles.langBtnMobile} onClick={alternarIdioma} type="button">
                        <Globe size={18} />
                        <span>{idioma === 'PT' ? 'PT/EN' : 'EN/PT'}</span>
                    </button>
                </ul>

                <button className={styles.langBtn} onClick={alternarIdioma} type="button">
                    <Globe size={18} />
                    <span>{idioma === 'PT' ? 'PT/EN' : 'EN/PT'}</span>
                </button>
            </nav>
        </main>
    );
}

export default Navbar;
