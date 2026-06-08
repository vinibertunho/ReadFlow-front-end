import styles from './Footer.module.css';
import { Link } from 'react-router-dom';
import { useIdioma } from '../../context/IdiomaContext';


function Footer() {
    const { idioma } = useIdioma();
    const en = idioma === 'EN';

    const ui = {
        tagline: en ? 'Your reading in a new flow.' : 'Sua leitura em um novo fluxo.',
        navTitle: en ? 'Navigation' : 'Navegação',
        home: en ? 'Home' : 'Home',
        biblioteca: en ? 'Library' : 'Biblioteca',
        explorar: en ? 'Explore Book' : 'Explorar Obra',
        equipe: en ? 'Team' : 'Equipe',
        vestibular: en ? 'Exam Prep' : 'Vestibular',
        quiz: 'Quiz',
        videoaulas: en ? 'Video Lessons' : 'Videoaulas',
        curiosidades: en ? 'Fun Facts' : 'Curiosidades',
        quemSomos: en ? 'About Us' : 'Quem Somos',
        contato: en ? 'Contact' : 'Contato',
        email: 'E-mail',
        telefone: en ? 'Phone' : 'Telefone',
        endereco: en ? 'Address' : 'Endereço',
        sac: en ? 'Talk to Support' : 'Falar com o SAC',
        copyright: en
            ? '© 2026 ReadFlow. All rights reserved.'
            : '© 2026 ReadFlow. Todos os direitos reservados.',
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.brand}>
                    <a href="/">
                        <img
                           src="/image/logo-do-readflow.png"
                            alt="Logo ReadFlow"
                            className={styles.logo}
                        />
                    </a>
                    <p>{ui.tagline}</p>
                </div>

                <div className={styles.nav}>
                    <h3>{ui.navTitle}</h3>
                    <ul>
                        <li>
                            <Link to="/">{ui.home}</Link>
                        </li>
                        <li>
                            <Link to="/biblioteca">{ui.biblioteca}</Link>
                        </li>
                        <li>
                            <Link to="/livro/capitaes-da-areia">{ui.explorar}</Link>
                        </li>
                        <li>
                            <Link to="/equipe">{ui.equipe}</Link>
                        </li>
                        <li>
                            <Link to="/vestibular">{ui.vestibular}</Link>
                        </li>
                        <li>
                            <Link to="/simulados">{ui.quiz}</Link>
                        </li>
                        <li>
                            <Link to="/videoaulas">{ui.videoaulas}</Link>
                        </li>
                        <li>
                            <Link to="/curiosidades">{ui.curiosidades}</Link>
                        </li>
                        <hr className={styles.navDivider} />
                        <li>
                            <Link to="/equipe">{ui.quemSomos}</Link>
                        </li>
                    </ul>
                </div>

                <div className={styles.contact}>
                    <h3>{ui.contato}</h3>
                    <p>
                        {ui.email}:{' '}
                        <a href="mailto:readflow@gmail.com" className={styles.contactLink}>
                            readflow@gmail.com
                        </a>
                    </p>
                    <p>
                        {ui.telefone}:{' '}
                        <a href="tel:1199999999" className={styles.contactLink}>
                            (11) 9999-9999
                        </a>
                    </p>
                    <p>
                        {ui.endereco}:{' '}
                        <a
                            href="https://maps.google.com/?q=Av.+Paulista,+1000+-+SP"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.contactLink}>
                            Av. Paulista, 1000 - SP
                        </a>
                    </p>
                    <a href="/suporte" className={styles.supportBtn}>
                        {ui.sac}
                    </a>
                </div>
            </div>

            <hr className={styles.divider} />

            <div className={styles.copyright}>
                <p>{ui.copyright}</p>
            </div>
        </footer>
    );
}

export default Footer;
