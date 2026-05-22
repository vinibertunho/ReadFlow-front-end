import styles from './Footer.module.css';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.brand}>
                    <a href="/">
                        <img
                            src="../../../public/image/logo-do-readflow.png"
                            alt="Logo ReadFlow"
                            className={styles.logo}
                        />
                    </a>
                    <p>Sua leitura em um novo fluxo.</p>
                </div>

                <div className={styles.nav}>
                    <h3>Navegação</h3>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/biblioteca">Biblioteca</Link>
                        </li>
                        <li>
                            <Link to="/livro">Explorar Obra</Link>
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
                        <hr className={styles.navDivider} />
                        <li>
                            <Link to="/equipe">Quem Somos</Link>
                        </li>
                    </ul>
                </div>

                <div className={styles.contact}>
                    <h3>Contato</h3>
                    <p>
                        E-mail:{' '}
                        <a href="mailto:suporte@readflow.com.br" className={styles.contactLink}>
                            readflow@gmail.com
                        </a>
                    </p>
                    <p>
                        Telefone:{' '}
                        <a href="tel:1199999999" className={styles.contactLink}>
                            (11) 9999-9999
                        </a>
                    </p>
                    <p>
                        Endereço:{' '}
                        <a
                            href="https://maps.google.com/?q=Av.+Paulista,+1000+-+SP"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.contactLink}>
                            Av. Paulista, 1000 - SP
                        </a>
                    </p>
                    <a href="/suporte" className={styles.supportBtn}>
                        Falar com o SAC
                    </a>
                </div>
            </div>

            <hr className={styles.divider} />

            <div className={styles.copyright}>
                <p>&copy; 2026 ReadFlow. Todos os direitos reservados.</p>
            </div>
        </footer>
    );
}

export default Footer;
