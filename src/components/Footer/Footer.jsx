import styles from './Footer.module.css';

function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* Identidade Visual */}
                <div className={styles.brand}>
                    <img src="/logo-readflow.svg" alt="Logo ReadFlow" className={styles.logo} />
                    <p>Sua leitura em um novo fluxo.</p>
                </div>

                {/* Navegação Secundária */}
                <div className={styles.nav}>
                    <h3>Navegação</h3>
                    <ul>
                        <li>
                            <a href="/sobre">Quem Somos</a>
                        </li>
                        <li>
                            <a href="/funcionalidades">Funcionalidades</a>
                        </li>
                        <li>
                            <a href="/precos">Planos</a>
                        </li>
                    </ul>
                </div>

                {/* Contatos e Suporte */}
                <div className={styles.contact}>
                    <h3>Contato</h3>
                    <p>E-mail: suporte@readflow.com.br</p>
                    <p>Telefone: (11) 9999-9999</p>
                    <p>Endereço: Av. Paulista, 1000 - SP</p>
                    <a href="/suporte" className={styles.supportBtn}>
                        Falar com o SAC
                    </a>
                </div>
            </div>

            <hr className={styles.divider} />

            {/* Direitos Autorais */}
            <div className={styles.copyright}>
                <p>&copy; 2026 ReadFlow. Todos os direitos reservados.</p>
            </div>
        </footer>
    );
}

export default Footer;
