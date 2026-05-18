import styles from './Footer.module.css';

function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.brand}>
                    <a href="/">
                        <img src="../../../public/image/logo-do-readflow.png" alt="Logo ReadFlow" className={styles.logo} />
                    </a>
                    <p>Sua leitura em um novo fluxo.</p>
                </div>

                <div className={styles.nav}>
                    <h3>Navegação</h3>
                    <ul>
                        <li>
                            <a href="../../pages/Home/Home.jsx">Home</a>
                        </li>
                        <li>
                            <a href="../../pages/Biblioteca de livros/Biblioteca.jsx">Biblioteca</a>
                        </li>
                        <li>
                            <a href="../../pages/Equipe/Equipe.jsx">Equipe</a>
                        </li>
                        <li>
                            <a href="../../pages/Vestibular/Vestibular.css">Vestibular</a>
                        </li>
                        <li>
                            <a href="../../pages/Simulados e quiz/Simulados.jsx">Quiz</a>
                        </li>
                        <li>
                            <a href="../../pages/Videoaulas/Videoaulas.jsx">Videoaulas</a>
                        </li>
                        <li>
                            <a href="../../pages/Curiosidades e dicas/Curiosidades.jsx">Curiosidades</a>
                        </li>
                        <hr className={styles.navDivider} />
                        <li>
                            <a href="../../pages/Equipe/Equipe.jsx">Quem Somos</a>
                        </li>
                    </ul>
                </div>

                <div className={styles.contact}>
                    <h3>Contato</h3>
                    <p>
                        E-mail: <a href="mailto:suporte@readflow.com.br" className={styles.contactLink}>readflow@gmail.com</a>
                    </p>
                    <p>
                        Telefone: <a href="tel:1199999999" className={styles.contactLink}>(11) 9999-9999</a>
                    </p>
                    <p>
                        Endereço: <a href="https://maps.google.com/?q=Av.+Paulista,+1000+-+SP" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>Av. Paulista, 1000 - SP</a>
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