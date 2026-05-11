import { Navigate } from 'react-router-dom';
import styles from './Home.module.css';

function Home() {
    return (
        <body>
            <main>
                <Navbar />
                <section className={styles.header}>
                    <div className={styles.criancasCorrendo}>
                        
                    </div>
                    <div className={styles.conteudoHeader}>
                        <div className={styles.textoHeader}>
                            <h4>Obra de Jorge Amado</h4>
                            <h1>Capitães da Areia</h1>
                            <p>resumo do livro aqui rs</p>
                            <button>Explorar mais</button>
                        </div>
                    </div>
                </section>
                <section className={styles.destaques}>
                    <div className={styles.apresentacao}>
                        <h3>Apresentação do Projeto</h3>
                        <p>Apresentacao do projeto aqui</p>
                    </div>
                    <div className={styles.cards}>
                        <div className={styles.explorarObra}>
                            <h4>Explorar obra</h4>
                            <p>Acompanhe a narrativa...</p>
                            <p>Ler Análise → </p>
                        </div>
                        <div className={styles.equipe}>
                            <h4>Equipe</h4>
                            <p>Conheça a equipe por trás do projeto...</p>
                            <p>Conhecer → </p>
                        </div>
                        <div className={styles.vestibulandos}>
                            <h4>Vestibulandos</h4>
                            <p>Página dedicada aos vestibulandos...</p>
                            <p>Estudar → </p>
                        </div>
                        <div className={styles.simulados}>
                            <h4>Simulados e Quizes</h4>
                            <p>Uooooou</p>
                            <p>Ver tester → </p>
                        </div>
                        <div className={styles.videoaulas}>
                            <h4>Videoaulas</h4>
                            <p>Assista às videoaulas...</p>
                            <p>Ver Galeria → </p>
                        </div>
                        <div className={styles.curiosidades}>
                            <h4>Curiosidades e Dicas</h4>
                            <p>Descubra curiosidades sobre o autor e a obra...</p>
                            <p>Explorar → </p>
                        </div>
                    </div>
                </section>
                <section className={styles.biblioteca}>
                    <div className={styles.fraseBonitaAesthetic}>
                        <h6>"Eram os donos do trapiche e da cidade, pois a cidade de Salvador lhes
pertencia por direito, a eles que não tinham nada e tinham tudo."</h6>
                        <p> — Jorge Amado, 1937 </p>
                    </div>
                    <div className={styles.bibliotecaRealOficial}>
                        <h3>Biblioteca de Livros</h3>
                        <p>Explore as obras analisadas por outras equipes do projeto.</p>
                    </div>
                </section>
            </main>
        </body>
    );
}
