import styles from './Home.module.css';
import Navbar from '../../components/Navbar/Navbar';

function Home() {
    return (
        <div className={styles.mainContainer}>
            <header className={styles.hero}>
                <Navbar />
                <div className={styles.heroInner}>
                    <div className={styles.heroBook}>
                        <img src="" alt="Capa Capitães da Areia" />
                    </div>
                    <div className={styles.heroInfo}>
                        <span className={styles.tag}>OBRA DE JORGE AMADO</span>
                        <h1>Capitães da Areia</h1>
                        <p>"sinopse" do livro. (resumo curto)</p>
                        <button className={styles.btnMain}>Explorar Obra</button>
                    </div>
                    <div className={styles.heroIllustration}>
                        <img src="" alt="Crianças correndo" />
                    </div>
                </div>
            </header>

            <section className={styles.sectionPresentation}>
                <h2 className={styles.sectionTitle}>Apresentação do Projeto</h2>
                <p className={styles.sectionSubtitle}>
                    Apresentação do projeto aqui (parte do povo do sesi)
                </p>

                <div className={styles.cardsGrid}>
                    <div className={styles.card}>
                        <span className={styles.icon}>📖</span>
                        <h3>Explorar obra</h3>
                        <p>
                            Acompanhe a narrativa desde a vida no Trapiche até os destinos traçados
                            pelo bando liderado por Pedro Bala.
                        </p>
                        <a href="#">Ler Análise →</a>
                    </div>
                    <div className={styles.card}>
                        <span className={styles.icon}>👥</span>
                        <h3>Equipe</h3>
                        <p>
                            Pedro Bala, Gato, Professor, Dora e o Sem-Pernas: conheça as motivações
                            e a alma de cada 'capitão'.
                        </p>
                        <a href="#">Explorar →</a>
                    </div>
                    <div className={styles.card}>
                        <span className={styles.icon}>🎓</span>
                        <h3>Vestibulandos</h3>
                        <p>
                            A Salvador dos anos 30: as desigualdades sociais e o surgimento do
                            romance proletário de Jorge Amado.
                        </p>
                        <a href="#">Explorar →</a>
                    </div>
                    {/* Outros 3 cards da segunda linha seguem o mesmo padrão */}
                </div>
            </section>

            {/* Citação */}
            <div className={styles.quoteContainer}>
                <p>
                    "Eram os donos do trapiche e da cidade, pois a cidade de Salvador lhes pertencia
                    por direito, a eles que não tinham nada e tinham tudo."
                </p>
                <span>— JORGE AMADO, 1937</span>
            </div>

            {/* BIBLIOTECA DE LIVROS */}
            <section className={styles.librarySection}>
                <div className={styles.libraryHeader}>
                    <h2>Biblioteca de Livros</h2>
                    <a href="#">Ver Todos ↗</a>
                </div>
                <div className={styles.booksGrid}>
                    <div className={styles.bookItem}>
                        <img
                            src="https://m.media-amazon.com/images/I/71p-Z3m76zL.jpg"
                            alt="O Cortiço"
                        />
                        <h4>O Cortiço</h4>
                        <p>Aluísio Azevedo</p>
                    </div>
                    <div className={styles.bookItem}>
                        <img
                            src="https://m.media-amazon.com/images/I/81aY1lxkS9L.jpg"
                            alt="Dom Casmurro"
                        />
                        <h4>Dom Casmurro</h4>
                        <p>Machado de Assis</p>
                    </div>
                    {/* Adicione os outros livros aqui */}
                </div>
            </section>

            {/* NEWSLETTER / FOOTER AZUL */}
            <footer className={styles.blueFooter}>
                <h3>Mergulhe no universo acadêmico</h3>
                <p>Receba análises profundas e materiais complementares.</p>
                <div className={styles.subscribeBox}>
                    <input type="text" placeholder="Seu melhor e-mail" />
                    <button>Inscrever-se</button>
                </div>
            </footer>
        </div>
    );
}

export default Home;
